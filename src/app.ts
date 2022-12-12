import 'dotenv/config'
import "reflect-metadata"
import express, {Request, Response} from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";
import {blogsRouter} from "./routers/blogs-route";
import {postsRouter} from "./routers/posts-route";
import {testingRouter} from "./routers/testing-route";
import {usersRouter} from "./routers/users-route";
import {authRouter} from "./routers/auth-route";
import {commentsRouter} from "./routers/comments-route";

export const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.set('trust proxy', true)

app.get('/', async (req: Request, res: Response) => {
    return res.send('Hello Application')
})

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/testing', testingRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)