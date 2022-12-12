import {ObjectId} from "mongodb";
import request from "supertest";
import {app} from "../../app";
import {runDb} from "../../db";

describe('test posts', () => {

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

    let blogId = ''
    let postId = ''
    const deleteUri = '/testing/all-data'
    const postsUri = '/posts'
    const blogsUri = '/blogs'


    const validBlog = {
        name: 'vadim-jest',
        description: 'valid description',
        websiteUrl: 'https://youtube.com'
    }

    const validPost = {
        title: "valid-title-TEST",
        shortDescription: "valid-SD-TEST",
        content: "valid-content-TEST",
        blogId: blogId,
        blogName: validBlog.name
    }

    const invalidPost = {
        title: "",
        shortDescription: "",
        content: "",
        blogId: new ObjectId()
    }

    const updatedPost = {
        title: "update-title-TEST",
        shortDescription: "update-SD-TEST",
        content: "update-content-TEST",
        blogId: blogId
    }

    describe('wipe all data Posts', () => {


        it('should clear DB Posts', async () => {
            const response = await request(server).delete(deleteUri)

            expect(response).toBeDefined()
            expect(response.status).toBe(204)
        })

        it('should return empty array Posts', async () => {
            const response = await request(server)
                .get(postsUri)


            expect(response).toBeDefined()
            expect(response.status).toBe(200)
            expect(response.body.items).toStrictEqual([])
        })
    })

    describe('create new BLOG', () => {
        it ('should return new BLOG', async () => {
            const response = await request(server).post(blogsUri).send(validBlog)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            blogId = response.body.id
            validPost.blogId = blogId
            updatedPost.blogId = blogId
            expect(response).toBeDefined()
            expect(response.status).toBe(201)
            expect(response.body.name).toBe(validBlog.name)
            expect(response.body.description).toBe(validBlog.description)
            expect(response.body.websiteUrl).toBe(validBlog.websiteUrl)
        })
    })

    describe('create Post', () => {
        it('should return error 401 if no BasicAuth for Post', async () => {
            const response = await request(server).post(postsUri).send(validPost)
            expect(response).toBeDefined()
            expect(response.status).toBe(401)
        })


        it('should return errors array because post not valid', async () => {
            const response = await request(server).post(postsUri).send(invalidPost)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            expect(response).toBeDefined()
            expect(response.status).toBe(400)
            expect(response.body.errorsMessages).toBeDefined()
            expect(response.body.errorsMessages.length).toBe(4)
        })

        it ('should return new Post', async () => {
            const response = await request(server).post(postsUri).send(validPost)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))
            postId = response.body.id
            expect(response).toBeDefined()
            expect(response.status).toBe(201)
            expect(response.body.title).toBe(validPost.title)
            expect(response.body.shortDescription).toBe(validPost.shortDescription)
            expect(response.body.content).toBe(validPost.content)
        })
    })

    describe('read created post', () => {
        it('should return posts', async () => {
            const response = await request(server).get(postsUri)

            expect(response).toBeDefined()
            expect(response.status).toBe(200)
            expect(response.body.pagesCount).toBe(1)
            expect(response.body.page).toBe(1)
            expect(response.body.totalCount).toBe(1)
            expect(response.body.items[0].title).toBe(validPost.title)
            expect(response.body.items[0].shortDescription).toBe(validPost.shortDescription)
            expect(response.body.items[0].content).toBe(validPost.content)
        })
        it('should return 404 Error', async () => {
            const response = await request(server).get(`${postsUri}/${new ObjectId()}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(404)
        })

        it('should return post', async () => {
            const response = await request(server).get(`${postsUri}/${postId}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(200)
            expect(response.body.title).toBe(validPost.title)
            expect(response.body.shortDescription).toBe(validPost.shortDescription)
            expect(response.body.content).toBe(validPost.content)
        })
    })

    describe('update post', () => {
        it('should return 401 error Unauthorized', async () => {
            const response = await request(server).put(`${postsUri}/${postId}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(401)
        })

        it ('should return error 404 if param not valid', async () => {
            const response = await request(server).put(`${postsUri}/${new ObjectId()}`).send(updatedPost)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            expect(response).toBeDefined()
            expect(response.status).toBe(404)
        })
        it ('should return status 204', async () => {
            const response = await request(server).put(`${postsUri}/${postId}`).send(updatedPost)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            expect(response).toBeDefined()
            expect(response.status).toBe(204)
        })

        it ('should return updated post', async () => {
            const response = await request(server).get(`${postsUri}/${postId}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(200)
            expect(response.body.title).toBe(updatedPost.title)
            expect(response.body.shortDescription).toBe(updatedPost.shortDescription)
            expect(response.body.content).toBe(updatedPost.content)
        })
    })

    describe('delete post', () => {
        it('should return 401 no BasicAuth', async () => {
            const response = await request(server).delete(`${postsUri}/${postId}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(401)
        })

        it('should return error 404 if param not valid', async () => {
            const response = await request(server).delete(`${postsUri}/${new ObjectId()}`)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))


            expect(response).toBeDefined()
            expect(response.status).toBe(404)
        })

        it('should return 204 status', async () => {
            const response = await request(server).delete(`${postsUri}/${postId}`)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            expect(response).toBeDefined()
            expect(response.status).toBe(204)
        })

        it('should return 404 after deleting blog', async () => {
            const response = await request(server).get(`${postsUri}/${postId}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(404)
        })
    })
})