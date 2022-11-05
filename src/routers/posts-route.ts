import {Router} from "express";
import {container} from "../composition-root";
import {PostsController} from "./controllers/posts-controller";
import {basicAuthMiddleware} from "../middlewares/basic-auth-middleware";
import {
    blogIdValidation,
    contentPostsValidation,
    shortDescriptionPostValidation,
    titlePostValidation,
} from "../middlewares/posts-validation-middleware";
import {errorsMiddleware} from "../middlewares/errors-validation-middleware";

export const postsRouter = Router({})

const postsController = container.resolve(PostsController)

const getPosts = postsController.getPosts.bind(postsController)
const getOnePost = postsController.getOnePost.bind(postsController)
const createPost = postsController.createPost.bind(postsController)

postsRouter.get('/', getPosts)

postsRouter.get('/:id',
    getOnePost)

postsRouter.post('/',
    basicAuthMiddleware,
    titlePostValidation,
    shortDescriptionPostValidation,
    contentPostsValidation,
    blogIdValidation,
    errorsMiddleware,
    createPost)