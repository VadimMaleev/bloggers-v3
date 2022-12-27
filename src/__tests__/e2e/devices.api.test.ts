import request from 'supertest';
import {ObjectId} from "mongodb";

import {app} from "../../app";
import {runDb} from "../../db";


describe('test devices', () => {

    let server

    beforeAll(async () => {
        server = await app.listen(5000)
        await runDb()
    })

    afterAll(async () => {
        await server.close()
    });

    const usersUri = '/users'
    const deleteUri = '/testing/all-data'
    const loginUri = '/auth/login'
    const devicesUri = '/security/devices'
    let userId = ''
    let token = ''
    let token2 = ''
    let refreshToken = ''
    let refreshToken2 = ''
    let device


    const validUser = {
        login: 'loginTEST',
        email: process.env.READ_EMAIL,
        password: '123TEST'
    }

    const loginValidUser = {
        loginOrEmail: 'loginTEST',
        password: '123TEST'
    }

    const validUser2 = {
        login: 'loginTEST2',
        email: 'hitest@g.com',
        password: '123TEST2'
    }

    const loginValidUser2 = {
        loginOrEmail: 'loginTEST2',
        password: '123TEST2'
    }

    describe('wipe all data', () => {

        it('should clear DB Users', async () => {
            const response = await request(server).delete(deleteUri)

            expect(response).toBeDefined()
            expect(response.status).toBe(204)
        })
    })

    describe('create user', () => {

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

    describe('login user', () =>{
        it('login - should return 200 status', async () => {
            const response = await request(server).post(loginUri).send(loginValidUser)
            token = response.body.accessToken
            refreshToken = response.headers['set-cookie']

            expect(response.status).toBe(200)
            expect(response.body.accessToken).toBeDefined()
        })
    })

    describe('get all devices for user', () => {
        it('should return Error 401', async () => {
            const response = await request(server).get(devicesUri)
            expect(response.status).toBe(401)
        })

        it('should return array of devices', async () => {
            const response = await request(server).get(devicesUri).set('Cookie', refreshToken)
            expect(response).toBeDefined()
            expect(response.status).toBe(200)
            expect(response.body[0]).toBeDefined()
            device = response.body[0]
            console.log(device)
        })
    })

    describe('create user', () => {

        it ('should return new user', async () => {
            const response = await request(server).post(usersUri).send(validUser2)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            userId = response.body.id
            expect(response).toBeDefined()
            expect(response.status).toBe(201)
            expect(response.body.login).toBe(validUser.login)
            expect(response.body.email).toBe(validUser.email)

        })
    })

    describe('login user', () =>{
        it('login - should return 200 status', async () => {
            const response = await request(server).post(loginUri).send(loginValidUser2)
            token2= response.body.accessToken
            refreshToken2 = response.headers['set-cookie']

            expect(response.status).toBe(200)
            expect(response.body.accessToken).toBeDefined()
        })
    })

    describe('delete device by Id', () => {
        it('should return Error 401', async () => {
            const response = await request(server).delete(`${devicesUri}/${device.deviceId}`)
            expect(response.status).toBe(401)
        })

        it( 'should return Error 404 because param not valid', async () => {
            const response = await request(server).delete(`${devicesUri}/${new ObjectId()}`)
                .set('Cookie', refreshToken)

            expect(response.status).toBe(404)
        })

        it('should return Error 403 Because deleting device of other user', async () => {
            const response = await request(server).delete(`${devicesUri}/${device.deviceId}`)
                .set('Cookie', refreshToken2)

            expect(response.status).toBe(403)
        })

        it('should return Error 403 Because deleting device of other user', async () => {
            const response = await request(server).delete(`${devicesUri}/${device.deviceId}`)
                .set('Cookie', refreshToken)

            expect(response.status).toBe(204)
        })

    })




})