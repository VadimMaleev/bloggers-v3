import {inject, injectable} from "inversify";
import {UserClass, UserForResponse} from "../types";
import {AuthService} from "./auth-service";
import {ObjectId} from "mongodb";
import {UsersRepository} from "../repositories/users-repository";

@injectable()
export class UsersService {
    constructor(
        @inject('as') protected authService: AuthService,
        @inject('ur') protected usersRepository: UsersRepository
    ) {
    }

    async createUser (login: string, password: string, email: string): Promise<UserForResponse> {
        const hash = await this.authService.generateHash(password)
        const newUser = new UserClass(
            new ObjectId(),
            login,
            email,
            hash,
            new Date()
        )
        await this.usersRepository.createUser(newUser)
        return {
            id: newUser.id,
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt
        }
    }

    async deleteUser(id: ObjectId): Promise<boolean> {
        return this.usersRepository.deleteUser(id)
    }
}