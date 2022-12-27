import {inject, injectable} from "inversify";
import bcrypt from "bcrypt"
import {UsersQueryRepository} from "../repositories/users-query-repository";
import {JWTService} from "./jwt-service";
import {DeviceClass, RecoveryCodeClass, UserClass, UserForResponse} from "../types/types";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {UsersRepository} from "../repositories/users-repository";
import {EmailAdapter} from "../adapters/email-adapter";
import {DevicesRepository} from "../repositories/devices-repository";
import {randomUUID} from "crypto";
import {DevicesQueryRepository} from "../repositories/devices-query-repository";
import {RecoveryCodesRepository} from "../repositories/recovery-codes-repository";

@injectable()
export class AuthService {
    constructor(
        @inject('uqr') protected usersQueryRepository: UsersQueryRepository,
        @inject('ur') protected usersRepository: UsersRepository,
        @inject('ea') protected emailAdapter: EmailAdapter,
        @inject('js') protected jwtService: JWTService,
        @inject('dr') protected devicesRepository: DevicesRepository,
        @inject('dqr') protected devicesQueryRepository: DevicesQueryRepository,
        @inject('rcr') protected recoveryCodesRepository: RecoveryCodesRepository
    ) {
    }

    async generateHash (password: string) {
        return await bcrypt.hash(password, 10)
    }

    // async checkPassword (password: string, passwordHash: string) {
    //     return await bcrypt.compare(password, passwordHash)
    // }

    async checkCredentials (loginOrEmail: string, password: string): Promise<UserClass | null> {
        const user: UserClass | null = await this.usersQueryRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!user || !user.isConfirmed) return null
        const isCompare = await bcrypt.compare(password, user.passwordHash);
        return isCompare ? user : null
    }

    async createToken(user: UserClass) {
        return this.jwtService.createJWT(user!)
    }

    async createRefreshToken (user: UserClass, ip:string, deviceName: string) {
        const deviceId = randomUUID()
        const refreshToken = await this.jwtService.createRefreshJWT(user!,deviceId)
        const lastActiveDate = this.jwtService.getLastActiveDateFromRefreshToken(refreshToken)
        const device = new DeviceClass(
            ip,
            deviceName,
            lastActiveDate,
            deviceId,
            user.id
        )
        await this.devicesRepository.createDevice(device)
        return refreshToken
    }

    async refreshToken(user: UserClass, oldRefreshToken: string) {
        const jwtPayload = await this.jwtService.extractPayloadFromToken(oldRefreshToken)
        const userId = user.id
        const deviceId = jwtPayload.deviceId
        const lastActiveDate = new Date(jwtPayload.iat * 1000).toISOString()
        const device = await this.devicesQueryRepository.findDeviceByDeviceAndUserIdAndDate(deviceId, userId, lastActiveDate)
        if (!device) return null
        const refreshToken = await this.jwtService.createRefreshJWT(user, deviceId)
        const newLastActiveDate = this.jwtService.getLastActiveDateFromRefreshToken(refreshToken)
        const isDateUpdated = await this.devicesRepository.updateLastActiveDateByDeviceAndUserId(deviceId, userId, newLastActiveDate)
        if (!isDateUpdated) return null
        return refreshToken
    }

    async createUser (login: string, password: string, email: string): Promise<UserForResponse> {
        const hash = await bcrypt.hash(password, 10)
        const newUser = new UserClass(
            new ObjectId(),
            login,
            email,
            hash,
            new Date(),
            uuidv4(),
            add(new Date(), {hours: 3}),
            false
        )
        await this.usersRepository.createUser(newUser)
        await this.emailAdapter.sendEmailConfirmationCode(newUser.confirmationCode, newUser.email)

        return {
            id: newUser.id,
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt
        }
    }

    async logout(user: UserClass, oldRefreshToken: string): Promise<boolean> {
        const jwtPayload = await this.jwtService.extractPayloadFromToken(oldRefreshToken)
        const userId = user.id
        const deviceId = jwtPayload.deviceId
        const lastActiveDate = new Date(jwtPayload.iat * 1000).toISOString()
        return this.devicesRepository.findAndDeleteDeviceByDeviceAndUserIdAndDate(userId, deviceId, lastActiveDate)
    }

    async passwordRecovery(user: UserClass) {
        const code = uuidv4()
        const recoveryCode = new RecoveryCodeClass(
            code,
            add(new Date(), {hours: 3}),
            user.id
        )

        await this.recoveryCodesRepository.createRecoveryCode(recoveryCode)
        await this.emailAdapter.passwordRecovery(code, user.email)
    }

    async newPassword(newPassword: string, recoveryCode: string): Promise<boolean> {
        const newPasswordHash = await bcrypt.hash(newPassword, 10)
        const code = await this.recoveryCodesRepository.findCode(recoveryCode)
        if (!code) return false
        if (code.codeExpirationDate < new Date()) return false


        await this.recoveryCodesRepository.deleteCode(recoveryCode)
        return await this.usersRepository.updatePassword(newPasswordHash, code.userId)
    }
}