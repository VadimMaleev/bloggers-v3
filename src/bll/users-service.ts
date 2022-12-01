import {inject, injectable} from "inversify";
import {UserClass, UserForResponse} from "../types/types";
import {AuthService} from "./auth-service";
import {ObjectId} from "mongodb";
import {UsersRepository} from "../repositories/users-repository";
import {v4 as uuidv4} from 'uuid'
import add from 'date-fns/add'
import {EmailAdapter} from "../adapters/email-adapter";
import {UsersQueryRepository} from "../repositories/users-query-repository";

@injectable()
export class UsersService {
    constructor(
        @inject('as') protected authService: AuthService,
        @inject('ur') protected usersRepository: UsersRepository,
        @inject('ea') protected emailAdapter: EmailAdapter,
        @inject('uqr') protected usersQueryRepository: UsersQueryRepository
    ) {
    }

    async createUser (login: string, password: string, email: string): Promise<UserForResponse> {
        const hash = await this.authService.generateHash(password)
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

    async confirmUser (code: string): Promise<boolean> {
        let user = await this.usersQueryRepository.findUserByCode(code)
        if (!user) return false
        if (user.isConfirmed) return false
        if (user.confirmationCode !== code) return false
        if (user.codeExpirationDate < new Date()) return false

        return await this.usersRepository.updateConfirmation(user.id)
    }

    async createNewConfirmCode (user: UserClass) {
        const confirmCode = uuidv4()
        const expirationDate = add(new Date(), {hours: 3})
        await this.usersRepository.updateConfirmCode(user, confirmCode, expirationDate)
        await this.emailAdapter.sendEmailConfirmationCode(confirmCode, user.email)
    }

    async deleteUser(id: ObjectId): Promise<boolean> {
        return this.usersRepository.deleteUser(id)
    }
}