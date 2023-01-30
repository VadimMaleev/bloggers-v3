import "reflect-metadata";
import {Router} from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {checkErrorsValidation} from "../middlewares/bodyValidationBloggers";
import {
    contentBodyValid,
    nameBodyValid,
    shortDescriptionBodyValid,
    titleBodyValid,
    youtubeBodyValid
} from "../middlewares/bodyBlogValidation";
import {myContainer} from "../composition-root";
import {BlogsController} from "./controllers/blogs-controller";
import {checkBlogInDB} from "../middlewares/checkBlogInDB";

export const blogsRouter = Router()

const blogsController = myContainer.resolve(BlogsController)

blogsRouter.get('/', blogsController.getBlogs.bind(blogsController))

blogsRouter.get('/:id/posts', blogsController.getPostByBlogId.bind(blogsController))

blogsRouter.get('/:id', blogsController.getBlogById.bind(blogsController))

blogsRouter.post('/', authMiddleware, youtubeBodyValid, nameBodyValid, checkErrorsValidation,
    blogsController.createBlog.bind(blogsController))

blogsRouter.post('/:id/posts', authMiddleware, shortDescriptionBodyValid,
    titleBodyValid, contentBodyValid, checkErrorsValidation, checkBlogInDB,
    blogsController.createPostByBlogId.bind(blogsController))

blogsRouter.put('/:id', authMiddleware, youtubeBodyValid, nameBodyValid, checkErrorsValidation,
    blogsController.updateBlogById.bind(blogsController))

blogsRouter.delete('/:id', authMiddleware, blogsController.deleteBlog.bind(blogsController))

blogsRouter.delete('/', authMiddleware, blogsController.deleteAllBlog.bind(blogsController))

