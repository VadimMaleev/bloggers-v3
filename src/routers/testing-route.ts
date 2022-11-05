import {Request, Response, Router} from "express";
import {BlogsModel, PostsModel} from "../schemas/mongoose-schemas";

export const testingRouter = Router({})

testingRouter.delete('/all-data',
    async (req: Request, res: Response) => {
            await BlogsModel.deleteMany({})
            await PostsModel.deleteMany({})
            return res.sendStatus(204)
    })

