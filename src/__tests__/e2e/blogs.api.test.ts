import request from 'supertest';
import {app} from "../../index";
import {ObjectId} from "mongodb";



describe('test', () => {
    it ('should return true', () => {
        expect(true).toBeTruthy()
    })

    let blogId = ''
    const deleteUri = '/testing/all-data'
    const blogsUri = '/blogs'



    const invalidBlog = {
        name: '',
        youtubeUrl: ''
    }

    const validBlog = {
        name: 'vadim-jest',
        youtubeUrl: 'https://youtube.com'
    }


    describe('wipe all data', () => {


        it('should clear DB', async () => {
            const response = await request(app).delete(deleteUri)

            expect(response).toBeDefined()
            expect(response.status).toBe(204)
        })

        it('should return empty array', async () => {
            const response = await request(app)
                .get(blogsUri)


            expect(response).toBeDefined()
            expect(response.status).toBe(200)
            expect(response.body).toStrictEqual([])
        })

    })

    describe('create blog', () => {

        it('should return error 401 if no BasicAuth', async () => {
            const response = await request(app).post(blogsUri).send(validBlog)
            expect(response).toBeDefined()
            expect(response.status).toBe(401)
        })


        it('should return errors array because blog not valid', async () => {
            const response = await request(app).post(blogsUri).send(invalidBlog)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            expect(response).toBeDefined()
            expect(response.status).toBe(400)
            expect(response.body.errorsMessages).toBeDefined()
            expect(response.body.errorsMessages.length).toBe(2)
            expect(response.body.errorsMessages[1].field).toBe('name')
            expect(response.body.errorsMessages[0].field).toBe('youtubeUrl')
        })

        it ('should return new blog', async () => {
            const response = await request(app).post(blogsUri).send(validBlog)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            blogId = response.body.id
            expect(response).toBeDefined()
            expect(response.status).toBe(201)
            expect(response.body).toStrictEqual({id: expect.any(String),...validBlog})
        })
    })

    describe('read created blog', () => {

        it('should return blogs', async () => {
            const response = await request(app).get(blogsUri)
            expect(response).toBeDefined()
            expect(response.status).toBe(200)
            expect(response.body[0].name).toBe(validBlog.name)
            expect(response.body[0].youtubeUrl).toBe(validBlog.youtubeUrl)

        })

        it('should return 404', async () => {
            const response = await request(app).get(`${blogsUri}/${new ObjectId()}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(404)
        })

        it('should return blog', async () => {
            const response = await request(app).get(`${blogsUri}/${blogId}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(200)
            expect(response.body.name).toBe(validBlog.name)
            expect(response.body.youtubeUrl).toBe(validBlog.youtubeUrl)
        })
    })
})


