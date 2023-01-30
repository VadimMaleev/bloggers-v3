import {UsersService} from "./users-service";
import {UsersRepository} from "../repositories/users-repository";
import {AuthService} from "./auth-service";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";

describe("integration tests fo UserService", () => {

    let mongoServer: MongoMemoryServer

    beforeAll( async () => {
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()
        await mongoose.connect(mongoUri)
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoServer.stop()
    })

    beforeEach(async () => {
        await mongoose.connection.db.dropDatabase()
    })

    const usersRepository = new UsersRepository()
    const authService = new AuthService(usersRepository)
    const userService = new UsersService(authService, usersRepository)

    describe("create user", () => {
        it("should return", async () => {
            let email = "shvs93@mail.ru";
            let login = "Vladislav";
            let password = "123";
            const spy = jest.spyOn(authService, "generateHash")
            const result = await userService.createUser(login, password, email)
            expect(result.email).toBe(email)
            expect(result.login).toBe(login)
            expect(spy).toBeCalled()
        })

    })


})