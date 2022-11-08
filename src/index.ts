import 'dotenv/config'
import "reflect-metadata"
import express, {Request, Response} from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";
import {runDb} from "./db";
import {blogsRouter} from "./routers/blogs-route";
import {postsRouter} from "./routers/posts-route";
import {testingRouter} from "./routers/testing-route";

export const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.set('trust proxy', true)

app.use('/', async (req: Request, res: Response) => {
    return res.send({'Hello Vercel!'})
})

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/testing', testingRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`App listening port ${port}`)
    })
}

startApp()