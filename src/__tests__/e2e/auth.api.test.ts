import {MailBoxImap} from "../../__tests-services__/imap.service";
import request from "supertest";
import {app} from "../../app";
import {runDb} from "../../db";
import * as cheerio from 'cheerio'

describe('auth tests',() => {
    jest.setTimeout(1000 * 60 * 3); // 3minutes


    let server

    const deleteUri = '/testing/all-data'
    const loginUri = '/auth/login'
    const registrationUri = '/auth/registration'
    const confirmationUri = '/auth/registration-confirmation'
    const aboutMeUri = '/auth/me'

    const validUser = {
        login: 'loginTEST',
        email: 'blogs-testing@yandex.by',
        password: '123TEST'
    }

    const loginValidUser = {
        loginOrEmail: 'loginTEST',
        password: '123TEST'
    }

    let confirmationCode = ''
    let token = ''


    beforeAll(async  () => {
        server = await app.listen(5000)
        await runDb()
        const mailBox = new MailBoxImap();
        await mailBox.connectToMail();
        expect.setState({ mailBox });
    })

    afterAll(async () => {
        const mailBox: MailBoxImap = expect.getState().mailBox;
        await mailBox.disconnect();
        await server.close()
    });

    describe('wipe all data ', () => {


        it('should clear DB Users', async () => {
            const response = await request(server).delete(deleteUri)

            expect(response).toBeDefined()
            expect(response.status).toBe(204)
        })
    })



    describe('registration user',() => {
        it('should return Error400 because InputModel is incorrect', async () => {
            const response = await request(server).post(registrationUri).send({})

            expect(response.status).toBe(400)
        })

        it('should return 204 status and send email', async () => {
            const response = await request(server).post(registrationUri).send(validUser)

            const mailBox: MailBoxImap = expect.getState().mailBox;
            const email = await mailBox.waitNewMessage(2);
            const html: any = await mailBox.getMessageHtml(email);
            expect(html).not.toBeNull();
            const link = cheerio.load(html).root().find('a').attr('href');
            confirmationCode = link.split('?')[1].split('=')[1];
            expect(confirmationCode).not.toBeNull();
            expect(confirmationCode).not.toBeUndefined();

            expect(response.status).toBe(204)
        })
    })

    describe('confirm user', () => {
        it('should return Error400 because confirmation code incorrect', async () => {
            const responseWithIncorrectField = await request(server).post(confirmationUri).send({confirmationCode: ''})
            expect(responseWithIncorrectField.status).toBe(400)

            const responseWithIncorrectCode = await request(server).post(confirmationUri).send({code: ''})
            expect(responseWithIncorrectCode.status).toBe(400)
        })



        it('should return 204 status', async () => {
            const response = await request(server).post(confirmationUri).send({code: confirmationCode})

            expect(response.status).toBe(204)
        })
    })

    describe('login user', () =>{
        it('login - should return 200 status', async () => {
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
        })
    })
})