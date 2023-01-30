import {Request, Response, Router} from 'express'
import {
    BlackListRefreshTokenModel,
    Blogs, CommentModel, Likes,
    Posts, RefreshToken, UserModel,
} from "../repositories/db";

export const testingRouter = Router({})

class TestingController {
    async clearAllCollection(req: Request, res: Response) {
        await Blogs.deleteMany({})
        await Posts.deleteMany({})
        await UserModel.deleteMany({})
        await CommentModel.deleteMany({})
        await BlackListRefreshTokenModel.deleteMany({})
        await Likes.deleteMany({})
        await RefreshToken.deleteMany({})
        res.sendStatus(204)
    }
}

const testingController = new TestingController()

testingRouter.delete('/all-data',
    testingController.clearAllCollection.bind(testingController))