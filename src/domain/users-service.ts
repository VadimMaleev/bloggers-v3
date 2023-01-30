import "reflect-metadata";
import {AuthService} from "./auth-service";
import {UserDBType, UserRepType, UserType} from "../repositories/types";
import {ObjectId} from "mongodb";
import {UsersRepository} from "../repositories/users-repository";
import {injectable} from "inversify";

@injectable()
export class UsersService {
    constructor(protected authService: AuthService, protected usersRepository: UsersRepository) {
    }

    async getUsers(pageNumber: number, pageSize: number): Promise<UserRepType> {
        return await this.usersRepository.getUsers(pageNumber, pageSize)
    }

    async createUser(login: string, password: string, email: string): Promise<UserType> {
        const newUser: UserType = {
            id: (new ObjectId()).toString(),
            login,
            email,
            createdAt: new Date
        }
        const hash: string = await this.authService.generateHash(password)
        return await this.usersRepository.createUser(newUser, hash)
    }

    async deleteUserById(id: string): Promise<boolean> {
        return await this.usersRepository.deleteUserById(id)
    }


    async findUserByLogin(login: string): Promise<boolean> {
        return await this.usersRepository.findUserByLogin(login)
    }

    async findUserById(id: ObjectId): Promise<UserDBType | null> {
        return await this.usersRepository.findUserById(id)
    }

    async findUserByEmail(email: string): Promise<UserDBType | null> {
        return await this.usersRepository.findUserByEmail(email)
    }

    async returnInfoAboutMe(userId: ObjectId) {
        return await this.usersRepository.returnInfoAboutMe(userId)
    }

    async findUserByIdAndReturnLogin(id: ObjectId): Promise<string> {
        const user = await this.usersRepository.findUserById(id)
        return user!.accountData.userName
    }
}