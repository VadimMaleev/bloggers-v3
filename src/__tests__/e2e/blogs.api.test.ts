import request from 'supertest';
import {app} from "../../index";
import {ObjectId} from "mongodb";



describe('test blogs', () => {
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

    const updatedBlog = {
        name: 'vadim-jest-upd',
        youtubeUrl: 'https://youtube.com/update'
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

    describe('update blog', () => {
        it('should return 401 error Unauthorized', async () => {
            const response = await request(app).put(`${blogsUri}/${blogId}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(401)
        })

        it ('should return error 404 if param not valid', async () => {
            const response = await request(app).put(`${blogsUri}/${new ObjectId()}`).send(updatedBlog)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            expect(response).toBeDefined()
            expect(response.status).toBe(404)
        })
        it ('should return status 204', async () => {
            const response = await request(app).put(`${blogsUri}/${blogId}`).send(updatedBlog)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            expect(response).toBeDefined()
            expect(response.status).toBe(204)
        })

        it ('should return updated blog', async () => {
            const response = await request(app).get(`${blogsUri}/${blogId}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(200)
            expect(response.body.name).toBe(updatedBlog.name)
            expect(response.body.youtubeUrl).toBe(updatedBlog.youtubeUrl)
        })
    })

    describe('delete blog', () => {
        it('should return 401 no BasicAuth', async () => {
            const response = await request(app).delete(`${blogsUri}/${blogId}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(401)
        })

        it('should return error 404 if param not valid', async () => {
            const response = await request(app).delete(`${blogsUri}/${new ObjectId()}`)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))


            expect(response).toBeDefined()
            expect(response.status).toBe(404)
        })

        it('should return 204 status', async () => {
            const response = await request(app).delete(`${blogsUri}/${blogId}`)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            expect(response).toBeDefined()
            expect(response.status).toBe(204)
        })

        it('should return 404 after deleting blog', async () => {
            const response = await request(app).get(`${blogsUri}/${blogId}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(404)
        })
    })
})

describe('test posts', () => {
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
        youtubeUrl: 'https://youtube.com'
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
            const response = await request(app).delete(deleteUri)

            expect(response).toBeDefined()
            expect(response.status).toBe(204)
        })

        it('should return empty array Posts', async () => {
            const response = await request(app)
                .get(postsUri)


            expect(response).toBeDefined()
            expect(response.status).toBe(200)
            expect(response.body).toStrictEqual([])
        })
    })

    describe('create new BLOG', () => {
        it ('should return new BLOG', async () => {
            const response = await request(app).post(blogsUri).send(validBlog)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            blogId = response.body.id
            validPost.blogId = blogId
            updatedPost.blogId = blogId
            expect(response).toBeDefined()
            expect(response.status).toBe(201)
            expect(response.body).toStrictEqual({id: expect.any(String),...validBlog})
        })
    })

    describe('create Post', () => {
        it('should return error 401 if no BasicAuth for Post', async () => {
            const response = await request(app).post(postsUri).send(validPost)
            expect(response).toBeDefined()
            expect(response.status).toBe(401)
        })


        it('should return errors array because post not valid', async () => {
            const response = await request(app).post(postsUri).send(invalidPost)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            expect(response).toBeDefined()
            expect(response.status).toBe(400)
            expect(response.body.errorsMessages).toBeDefined()
            expect(response.body.errorsMessages.length).toBe(4)
        })

        it ('should return new Post', async () => {
            const response = await request(app).post(postsUri).send(validPost)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))
            console.log(validPost.blogId)
            postId = response.body.id
            expect(response).toBeDefined()
            expect(response.status).toBe(201)
            expect(response.body).toStrictEqual({id: expect.any(String),...validPost})
        })
    })

    describe('read created post', () => {
        it('should return posts', async () => {
            const response = await request(app).get(postsUri)

            expect(response).toBeDefined()
            expect(response.status).toBe(200)
            expect(response.body[0].title).toBe(validPost.title)
            expect(response.body[0].shortDescription).toBe(validPost.shortDescription)
            expect(response.body[0].content).toBe(validPost.content)
        })
        it('should return 404 Error', async () => {
            const response = await request(app).get(`${postsUri}/${new ObjectId()}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(404)
        })

        it('should return post', async () => {
            const response = await request(app).get(`${postsUri}/${postId}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(200)
            expect(response.body.title).toBe(validPost.title)
            expect(response.body.shortDescription).toBe(validPost.shortDescription)
            expect(response.body.content).toBe(validPost.content)
        })
    })

    describe('update post', () => {
        it('should return 401 error Unauthorized', async () => {
            const response = await request(app).put(`${postsUri}/${postId}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(401)
        })

        it ('should return error 404 if param not valid', async () => {
            const response = await request(app).put(`${postsUri}/${new ObjectId()}`).send(updatedPost)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            expect(response).toBeDefined()
            expect(response.status).toBe(404)
        })
        it ('should return status 204', async () => {
            const response = await request(app).put(`${postsUri}/${postId}`).send(updatedPost)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            expect(response).toBeDefined()
            expect(response.status).toBe(204)
        })

        it ('should return updated post', async () => {
            const response = await request(app).get(`${postsUri}/${postId}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(200)
            expect(response.body.title).toBe(updatedPost.title)
            expect(response.body.shortDescription).toBe(updatedPost.shortDescription)
            expect(response.body.content).toBe(updatedPost.content)
        })
    })

    describe('delete post', () => {
        it('should return 401 no BasicAuth', async () => {
            const response = await request(app).delete(`${postsUri}/${postId}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(401)
        })

        it('should return error 404 if param not valid', async () => {
            const response = await request(app).delete(`${postsUri}/${new ObjectId()}`)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))


            expect(response).toBeDefined()
            expect(response.status).toBe(404)
        })

        it('should return 204 status', async () => {
            const response = await request(app).delete(`${postsUri}/${postId}`)
                .set("Authorization", "Basic " + new Buffer("admin:qwerty").toString("base64"))

            expect(response).toBeDefined()
            expect(response.status).toBe(204)
        })

        it('should return 404 after deleting blog', async () => {
            const response = await request(app).get(`${postsUri}/${postId}`)

            expect(response).toBeDefined()
            expect(response.status).toBe(404)
        })
    })
})

