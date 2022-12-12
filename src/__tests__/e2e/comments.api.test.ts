import request from "supertest";
import {ObjectId} from "mongodb";
import {app} from "../../app";
import {runDb} from "../../db";

describe('test comments', () => {
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
    let commentId = ''
    const postsUri = '/posts'
    const blogsUri = '/blogs'
    let token = ''
    let token2 = ''
    let userId = ''
    const deleteUri = '/testing/all-data'
    const usersUri = '/users'
    const loginUri = '/auth/login'
    const commentsUri = '/comments'

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

    const validUser = {
        login: 'loginTEST',
        email: 'emailTEST@g.com',
        password: '123TEST'
    }

    const validUser2 = {
        login: 'loginTEST2',
        email: 'emailTEST2@g.com',
        password: '123TEST2'
    }

    const invalidComment = {
        content: ''
    }

    const validComment = {
        content: 'valid content for comment with JEST testing'
    }

    const updateComment = {
        content: 'UPDATED valid content for comment with JEST testing'
    }

    const loginValidUser = {
        loginOrEmail: 'loginTEST',
        password: '123TEST'
    }

    const loginValidUser2 = {
        loginOrEmail: 'loginTEST2',
        password: '123TEST2'
    }

    describe('wipe all data ', () => {


        it('should clear DB Users', async () => {
            const response = await request(server).delete(deleteUri)

            expect(response).toBeDefined()
            expect(response.status).toBe(204)
        })
    })

    describe('create new blog, post and user for comments + login', () => {
        it ('should return new user', async () => {
            const response = await request(server).post(usersUri).send(validUser)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            userId = response.body.id
            expect(response).toBeDefined()
            expect(response.status).toBe(201)
            expect(response.body.login).toBe(validUser.login)
            expect(response.body.email).toBe(validUser.email)
        })

        it ('should return new user 2', async () => {
            const response = await request(server).post(usersUri).send(validUser2)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            expect(response).toBeDefined()
            expect(response.status).toBe(201)
            expect(response.body.login).toBe(validUser2.login)
            expect(response.body.email).toBe(validUser2.email)
        })

        it ('should return new BLOG', async () => {
            const response = await request(server).post(blogsUri).send(validBlog)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            blogId = response.body.id
            validPost.blogId = blogId
            expect(response).toBeDefined()
            expect(response.status).toBe(201)
            expect(response.body.name).toBe(validBlog.name)
            expect(response.body.description).toBe(validBlog.description)
            expect(response.body.websiteUrl).toBe(validBlog.websiteUrl)
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

        it('login - should return 200 status', async () => {
            const response = await request(server).post(loginUri).send(loginValidUser)
            token = response.body.accessToken
            expect(response.status).toBe(200)
            expect(response.body.accessToken).toBeDefined()
        })

        it('login user 2 - should return 200 status', async () => {
            const response = await request(server).post(loginUri).send(loginValidUser2)
            token2 = response.body.accessToken
            expect(response.status).toBe(200)
            expect(response.body.accessToken).toBeDefined()
        })

    })

    describe('create and read comment for post', () => {

        it('should return Error400 because inputModel invalid', async () => {

            const response = await request(server).post(`${postsUri}/${postId}/comments`).send(invalidComment)
                .set("Authorization", "Bearer " + token)
            expect(response).toBeDefined()
            expect(response.status).toBe(400)
        })

        it('should return Error401', async () => {
            const response = await request(server).post(`${postsUri}/${postId}/comments`).send(validComment)
            expect(response).toBeDefined()
            expect(response.status).toBe(401)
        })

        it('should return Error404', async () => {
            const response = await request(server).post(`${postsUri}/${new ObjectId()}/comment`).send(validComment)
            expect(response.status).toBe(404)
        })

        it ('should create new comment', async () => {
            const response = await request(server).post(`${postsUri}/${postId}/comments`).send(validComment)
                .set("Authorization", "Bearer " + token)
            commentId = response.body.id

            expect(response.status).toBe(201)
            expect(response.body.content).toBe(validComment.content)
        })

        it ('should return Error404 from GET Request', async () => {
            const response = await request(server).get(`${postsUri}/${new ObjectId()}/comments`)

            expect(response.status).toBe(404)
        })

        it ('should return created comment from GET Request', async () => {
            const response = await request(server).get(`${postsUri}/${postId}/comments`)

            expect(response.status).toBe(200)
            expect(response.body.items[0].content).toBe(validComment.content)
        })
    })


    describe('get comment and put comment', () => {
        it('should return Error404', async () => {
            const response = await request(server).get(`${commentsUri}/${new ObjectId()}`)
            expect(response.status).toBe(404)
        })

        it ('should return comment', async () => {
            const response = await request(server).get(`${commentsUri}/${commentId}`)

            expect(response.status).toBe(200)
            expect(response.body.content).toBe(validComment.content)
            expect(response.body.userId).toBe(userId)
        })

        it ('should return Error400', async () => {
            const response = await request(server).put(`${commentsUri}/${commentId}`).send({})
                .set("Authorization", "Bearer " + token)

            expect(response.status).toBe(400)
        })

        it ('should return Error401', async () => {
            const response = await request(server).put(`${commentsUri}/${commentId}`).send({})

            expect(response.status).toBe(401)
        })

        it ('should return Error403', async () => {
            const response = await request(server).put(`${commentsUri}/${commentId}`).send(updateComment)
                .set("Authorization", "Bearer " + token2)

            expect(response.status).toBe(403)
        })

        it ('should return Error404', async () => {
            const response = await request(server).put(`${commentsUri}/${new ObjectId()}`).send(updateComment)
                .set("Authorization", "Bearer " + token)

            expect(response.status).toBe(404)
        })

        it ('should return 204 status', async () => {
            const response = await request(server).put(`${commentsUri}/${commentId}`).send(updateComment)
                .set("Authorization", "Bearer " + token)

            expect(response.status).toBe(204)
        })

        it ('should return updated comment', async () => {
            const response = await request(server).get(`${commentsUri}/${commentId}`)

            expect(response.status).toBe(200)
            expect(response.body.content).toBe(updateComment.content)
            expect(response.body.userId).toBe(userId)
        })
    })

    describe('delete comment', () => {
        it ('should return Error401', async () => {
            const response = await request(server).delete(`${commentsUri}/${commentId}`)

            expect(response.status).toBe(401)
        })

        it ('should return Error403', async () => {
            const response = await request(server).delete(`${commentsUri}/${commentId}`)
                .set("Authorization", "Bearer " + token2)

            expect(response.status).toBe(403)
        })

        it ('should return Error404', async () => {
            const response = await request(server).delete(`${commentsUri}/${new ObjectId()}`)
                .set("Authorization", "Bearer " + token)

            expect(response.status).toBe(404)
        })

        it ('should return 204 status', async () => {
            const response = await request(server).delete(`${commentsUri}/${commentId}`)
                .set("Authorization", "Bearer " + token)

            expect(response.status).toBe(204)
        })

        it ('should return Error404', async () => {
            const response = await request(server).delete(`${commentsUri}/${commentId}`)
                .set("Authorization", "Bearer " + token)

            expect(response.status).toBe(404)
        })
    })
})