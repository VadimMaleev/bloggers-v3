import {Router} from "express";
import {container} from "../composition-root";
import {CommentsController} from "./controllers/comments-controller";
import {jwtAuthMiddleware} from "../middlewares/jwt-auth-middleware";
import {commentsValidation} from "../middlewares/comment-validation-middleware";
import {errorsMiddleware} from "../middlewares/errors-validation-middleware";

export const commentsRouter = Router({})

const commentsController = container.resolve(CommentsController)

const getCommentById = commentsController.getCommentById.bind(commentsController)
const updateComment = commentsController.updateComment.bind(commentsController)
const deleteComment = commentsController.deleteComment.bind(commentsController)

commentsRouter.get('/:id',
    getCommentById)

commentsRouter.put('/:id',
    jwtAuthMiddleware,
    commentsValidation,
    errorsMiddleware,
    updateComment)

commentsRouter.delete('/:id',
    jwtAuthMiddleware,
    deleteComment)