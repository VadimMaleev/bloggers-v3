import request from "supertest";
import {ObjectId} from "mongodb";
import {app} from "../../app";
import {runDb} from "../../db";

describe('test users', () => {
    let server

    beforeAll(async  () => {
        server = await app.listen(5000)
        await runDb()
    })

    afterAll(async () => {
        await server.close()
    });

    it('should return true', () => {
        expect(true).toBeTruthy()
    })


    let token = ''
    let userId = ''
    const deleteUri = '/testing/all-data'
    const usersUri = '/users'
    const loginUri = '/auth/login'
    const aboutMeUri = '/auth/me'

    const validUser = {
        login: 'loginTEST',
        email: process.env.READ_EMAIL,
        password: '123TEST'
    }

    const invalidUser = {
        login: '',
        email: '',
        password: ''
    }

    const loginInvalidUser = {}

    const loginValidUser = {
        loginOrEmail: validUser.login,
        password: validUser.password
    }

    const invalidPasswordUser = {
        loginOrEmail: 'loginTEST',
        password: 'invalidPassTEST'
    }

    const invalidLoginOrEmailUser = {
        loginOrEmail: 'login',
        password: '123TEST'
    }



    describe('wipe all data Posts', () => {


        it('should clear DB Users', async () => {
            const response = await request(server).delete(deleteUri)

            expect(response).toBeDefined()
            expect(response.status).toBe(204)
        })
        it('should return empty array Users', async () => {
            const response = await request(server)
                .get(usersUri)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))


            expect(response).toBeDefined()
            expect(response.status).toBe(200)
            expect(response.body.items).toStrictEqual([])
        })
    })

    describe('create user', () => {

        it('should return error 401 if no BasicAuth', async () => {
            const response = await request(server).post(usersUri).send(validUser)
            expect(response).toBeDefined()
            expect(response.status).toBe(401)
        })


        it('should return errors array because user not valid', async () => {
            const response = await request(server).post(usersUri).send(invalidUser)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            expect(response).toBeDefined()
            expect(response.status).toBe(400)
            expect(response.body.errorsMessages).toBeDefined()
            expect(response.body.errorsMessages.length).toBe(3)
        })

        it ('should return new user', async () => {
            const response = await request(server).post(usersUri).send(validUser)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            userId = response.body.id
            expect(response).toBeDefined()
            expect(response.status).toBe(201)
            expect(response.body.login).toBe(validUser.login)
            expect(response.body.email).toBe(validUser.email)

        })
    })

    describe('read created user', () => {

        it('should return users', async () => {
            const response = await request(server).get(usersUri)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            expect(response.status).toBe(200)
            expect(response.body.pagesCount).toBe(1)
            expect(response.body.page).toBe(1)
            expect(response.body.totalCount).toBe(1)
            expect(response.body.items[0].login).toBe(validUser.login)
            expect(response.body.items[0].email).toBe(validUser.email)
        })
    })



    describe('login user', () => {
        it('should return 400 error', async () => {
            const response = await request(server).post(loginUri).send(loginInvalidUser)
            expect(response.status).toBe(400)
            expect(response.body.errorsMessages.length).toBe(2)
        })

        it('should return 401 error if login invalid', async () => {
            const response = await request(server).post(loginUri).send(invalidLoginOrEmailUser)
            expect(response.status).toBe(401)
        })

        it('should return 401 error if password invalid', async () => {
            const response = await request(server).post(loginUri).send(invalidPasswordUser)
            expect(response.status).toBe(401)
        })



        it('should return 200 status', async () => {
            const response = await request(server).post(loginUri).send(loginValidUser)
            token = response.body.accessToken
            expect(response.status).toBe(200)
            expect(response.body.accessToken).toBeDefined()
        })


        it('should return user info', async () => {
            const response = await request(server).get(aboutMeUri)
                .set("Authorization", "Bearer " + token)

            expect(response).toBeDefined()
            expect(response.status).toBe(200)
            expect(response.body.email).toBe(validUser.email)
            expect(response.body.login).toBe(validUser.login)
            expect(response.body.userId).toBe(userId)
        })
    })

    describe ('delete user', () => {
        it('should return error 401 if no BasicAuth', async () => {
            const response = await request(server).delete(`${usersUri}/${userId}`)
            expect(response).toBeDefined()
            expect(response.status).toBe(401)
        })

        it('should return 404 error', async () => {
            const response = await request(server).delete(`${usersUri}/${new ObjectId()}`)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            expect(response).toBeDefined()
            expect(response.status).toBe(404)
        })

        it('should return 204 status', async () => {
            const response = await request(server).delete(`${usersUri}/${userId}`)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            expect(response.status).toBe(204)
        })

        it('should return empty array of Users', async () => {
            const response = await request(server)
                .get(usersUri)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))


            expect(response).toBeDefined()
            expect(response.status).toBe(200)
            expect(response.body.items).toStrictEqual([])
        })

        it('should return 404 after deleting user', async () => {
            const response = await request(server).get(`${usersUri}/${userId}`)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))


            expect(response).toBeDefined()
            expect(response.status).toBe(404)
        })
    })

})