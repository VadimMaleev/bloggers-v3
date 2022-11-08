import {Router} from "express";
import {BlogsController} from "./controllers/blogs-controller";
import {container} from "../composition-root";
import {basicAuthMiddleware} from "../middlewares/basic-auth-middleware";
import {
    nameBloggersValidation,
    youtubeUrlBloggersValidation
} from "../middlewares/bloggers-validation-middleware";
import {errorsMiddleware} from "../middlewares/errors-validation-middleware";

export const blogsRouter = Router({})

const blogsController = container.resolve(BlogsController)

const getBlogs = blogsController.getBlogs.bind(blogsController)
const getOneBlogById = blogsController.getOneBlogById.bind(blogsController)
const createBlog = blogsController.createBlog.bind(blogsController)
const updateBlog = blogsController.updateBlog.bind(blogsController)
const deleteBlog = blogsController.deleteBlog.bind(blogsController)

blogsRouter.get('/', getBlogs)

blogsRouter.get('/:id',
    getOneBlogById)

blogsRouter.post('/',
    basicAuthMiddleware,
    youtubeUrlBloggersValidation,
    nameBloggersValidation,
    errorsMiddleware,
    createBlog)

blogsRouter.put('/:id',
    basicAuthMiddleware,
    youtubeUrlBloggersValidation,
    nameBloggersValidation,
    errorsMiddleware,
    updateBlog)

blogsRouter.delete('/:id',
    basicAuthMiddleware,
    deleteBlog)