import {inject, injectable} from "inversify";
import bcrypt from "bcrypt"
import {UsersQueryRepository} from "../repositories/users-query-repository";
import {JWTService} from "./jwt-service";

@injectable()
export class AuthService {
    constructor(
        @inject('uqr') protected usersQueryRepository: UsersQueryRepository,
        @inject('js') protected jwtService: JWTService
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

    async createToken(login: string) {
        const user = await this.usersQueryRepository.findUserByLoginOrEmail(login)
        if (user === null) return null
        const token = await this.jwtService.createJWT(user!)
        return {"accessToken": token}
    }
}