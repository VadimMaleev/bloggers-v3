import {inject, injectable} from "inversify";
import bcrypt from "bcrypt"
import {UsersQueryRepository} from "../repositories/users-query-repository";

@injectable()
export class AuthService {
    constructor(
        @inject('uqr') protected usersQueryRepository: UsersQueryRepository
    ) {
    }

    async generateHash (password: string) {
        return await bcrypt.hash(password, 10)
    }

    // async checkPassword (password: string, passwordHash: string) {
    //     return await bcrypt.compare(password, passwordHash)
    // }

    async checkCredentials (loginOrEmail: string, password: string): Promise<boolean> {
        const user = await this.usersQueryRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!user) return false
        return await bcrypt.compare(password, user.passwordHash);
    }
}