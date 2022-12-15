import {inject, injectable} from "inversify";
import bcrypt from "bcrypt"
import {UsersQueryRepository} from "../repositories/users-query-repository";
import {JWTService} from "./jwt-service";
import {DeviceClass, UserClass, UserForResponse} from "../types/types";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {UsersRepository} from "../repositories/users-repository";
import {EmailAdapter} from "../adapters/email-adapter";
import {DevicesRepository} from "../repositories/devices-repository";

@injectable()
export class AuthService {
    constructor(
        @inject('uqr') protected usersQueryRepository: UsersQueryRepository,
        @inject('ur') protected usersRepository: UsersRepository,
        @inject('ea') protected emailAdapter: EmailAdapter,
        @inject('js') protected jwtService: JWTService,
        @inject('dr') protected devicesRepository: DevicesRepository
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
        const deviceId = uuidv4().toString()
        const device = new DeviceClass(
            ip,
            deviceName,
            new Date(),
            deviceId,
            user.id
        )
        await this.devicesRepository.createDevice(device)
        return this.jwtService.createRefreshJWT(user!,deviceId)
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
}