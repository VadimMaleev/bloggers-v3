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
import {jwtAuthMiddleware} from "../middlewares/jwt-auth-middleware";
import {commentsValidation} from "../middlewares/comment-validation-middleware";
import {likeInputValidation, likeValidationMiddleware} from "../middlewares/like-validation-middleware";


export const postsRouter = Router({})

const postsController = container.resolve(PostsController)

const getPosts = postsController.getPosts.bind(postsController)
const getOnePost = postsController.getOnePostById.bind(postsController)
const createPost = postsController.createPost.bind(postsController)
const updatePost = postsController.updatePost.bind(postsController)
const deletePost = postsController.deletePost.bind(postsController)
const createComment = postsController.createComment.bind(postsController)
const getCommentsForPost = postsController.getCommentsForPost.bind(postsController)
const makeLikeOrUnlikeForPost = postsController.makeLikeOrUnlikeForPost.bind(postsController)

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

postsRouter.put('/:id',
    basicAuthMiddleware,
    titlePostValidation,
    shortDescriptionPostValidation,
    contentPostsValidation,
    blogIdValidation,
    errorsMiddleware,
    updatePost)

postsRouter.delete('/:id',
    basicAuthMiddleware,
    deletePost)

postsRouter.post('/:id/comments',
    jwtAuthMiddleware,
    commentsValidation,
    errorsMiddleware,
    createComment)

postsRouter.get('/:id/comments',
    getCommentsForPost)

postsRouter.put('/:id/like-status',
    jwtAuthMiddleware,
    likeInputValidation,
    errorsMiddleware,
    likeValidationMiddleware,
    makeLikeOrUnlikeForPost
    )

