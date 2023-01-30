import express from 'express'
import cors from 'cors'
import {blogsRouter} from "./Routes/blogs-router";
import {postsRouter} from "./Routes/posts-router";
import {runDb} from "./repositories/db";
import {usersRouter} from "./Routes/users-router";
import {authRouter} from "./Routes/auth-router";
import {commentsRouter} from "./Routes/comments-router";
import {testingRouter} from "./Routes/testing-router";
import cookieParser from 'cookie-parser';
import {pairQuizGamesRouter} from "./Routes/pairQuizGame-router";
import {securityRouter} from "./Routes/security-router";

const app = express()

app.set('trust proxy', true)
app.use(cors())
app.use(express.json());
app.use(cookieParser())

const port = process.env.PORT || 5000
console.log('All Good: listen port',  port)


app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)
app.use('/testing', testingRouter)
app.use('/pair-game-quiz', pairQuizGamesRouter)
app.use('/security', securityRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port: ${port}`)
    })
}

startApp()



