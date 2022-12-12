import request from 'supertest';
import {ObjectId} from "mongodb";

import {app} from "../../app";
import {runDb} from "../../db";


describe('test blogs', () => {

    it ('should return true', () => {
        expect(true).toBeTruthy()
    })

    let blogId = ''
    const deleteUri = '/testing/all-data'
    const blogsUri = '/blogs'


    const invalidBlog = {
        name: '',
        description: '',
        websiteUrl: ''
    }

    const validBlog = {
        name: 'vadim-jest',
        description: 'valid description',
        websiteUrl: 'https://youtube.com'
    }

    const updatedBlog = {
        name: 'vadim-jest-upd',
        description: 'description update',
        websiteUrl: 'https://youtube.com/update'
    }

    let server

    beforeAll(async  () => {
        server = await app.listen(5000)
        await runDb()
    })

    afterAll(async () => {
        await server.close()
    });

    describe('wipe all data', () => {


        it('should clear DB', async () => {
            const response = await request(server).delete(deleteUri)

            expect(response).toBeDefined()
            expect(response.status).toBe(204)
        })

        it('should return empty array', async () => {
            const response = await request(server)
                .get(blogsUri)


            expect(response).toBeDefined()
            expect(response.status).toBe(200)
            expect(response.body.items).toStrictEqual([])
        })

    })

    describe('create blog', () => {

        it('should return error 401 if no BasicAuth', async () => {
            const response = await request(server).post(blogsUri).send(validBlog)
            expect(response).toBeDefined()
            expect(response.status).toBe(401)
        })


        it('should return errors array because blog not valid', async () => {
            const response = await request(server).post(blogsUri).send(invalidBlog)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            expect(response).toBeDefined()
            expect(response.status).toBe(400)
            expect(response.body.errorsMessages).toBeDefined()
            expect(response.body.errorsMessages.length).toBe(3)
        })

        it ('should return new blog', async () => {
            const response = await request(server).post(blogsUri).send(validBlog)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            blogId = response.body.id
            expect(response).toBeDefined()
            expect(response.status).toBe(201)
            expect(response.body.name).toBe(validBlog.name)
            expect(response.body.websiteUrl).toBe(validBlog.websiteUrl)
            expect(response.body.description).toBe(validBlog.description)
        })
    })

    describe('read created blog', () => {

        it('should return blogs', async () => {
            const response = await request(server).get(blogsUri)
            expect(response).toBeDefined()
            expect(response.status).toBe(200)
            expect(response.body.pagesCount).toBe(1)
            expect(response.body.page).toBe(1)
            expect(response.body.totalCount).toBe(1)
            expect(response.body.items[0].name).toBe(validBlog.name)
            expect(response.body.items[0].description).toBe(validBlog.description)
            expect(response.body.items[0].websiteUrl).toBe(validBlog.websiteUrl)
        })

        it('should return 404', async () => {
            const response = await request(server).get(`${blogsUri}/${new ObjectId()}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(404)
        })

        it('should return blog', async () => {
            const response = await request(server).get(`${blogsUri}/${blogId}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(200)
            expect(response.body.name).toBe(validBlog.name)
            expect(response.body.description).toBe(validBlog.description)
            expect(response.body.websiteUrl).toBe(validBlog.websiteUrl)
        })
    })

    describe('update blog', () => {
        it('should return 401 error Unauthorized', async () => {
            const response = await request(server).put(`${blogsUri}/${blogId}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(401)
        })

        it ('should return error 404 if param not valid', async () => {
            const response = await request(server).put(`${blogsUri}/${new ObjectId()}`).send(updatedBlog)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            expect(response).toBeDefined()
            expect(response.status).toBe(404)
        })
        it ('should return status 204', async () => {
            const response = await request(server).put(`${blogsUri}/${blogId}`).send(updatedBlog)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            expect(response).toBeDefined()
            expect(response.status).toBe(204)
        })

        it ('should return updated blog', async () => {
            const response = await request(server).get(`${blogsUri}/${blogId}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(200)
            expect(response.body.name).toBe(updatedBlog.name)
            expect(response.body.description).toBe(updatedBlog.description)
            expect(response.body.websiteUrl).toBe(updatedBlog.websiteUrl)
        })
    })

    describe('delete blog', () => {
        it('should return 401 no BasicAuth', async () => {
            const response = await request(server).delete(`${blogsUri}/${blogId}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(401)
        })

        it('should return error 404 if param not valid', async () => {
            const response = await request(server).delete(`${blogsUri}/${new ObjectId()}`)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))


            expect(response).toBeDefined()
            expect(response.status).toBe(404)
        })

        it('should return 204 status', async () => {
            const response = await request(server).delete(`${blogsUri}/${blogId}`)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            expect(response).toBeDefined()
            expect(response.status).toBe(204)
        })

        it('should return 404 after deleting blog', async () => {
            const response = await request(server).get(`${blogsUri}/${blogId}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(404)
        })
    })
})











