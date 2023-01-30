import "reflect-metadata";
import {Router} from "express";
import {authTokenMiddleware} from "../middlewares/Auth-token-middleware";
import {checkErrorsValidation} from "../middlewares/bodyValidationBloggers";
import {checkUserForOwner} from "../middlewares/checkUserForOwner";
import {contentCommentBodyValid, LikeValid} from "../middlewares/bodyPostValidation";
import {myContainer} from "../composition-root";
import {CommentsController} from "./controllers/comments-controller";
import {searchCommentByIdValidation} from "../middlewares/searchCommentByIdValidation";


export const commentsRouter = Router()

const commentsController = myContainer.resolve(CommentsController)


commentsRouter.get('/:id', commentsController.getCommentById.bind(commentsController))

commentsRouter.delete('/:commentId', authTokenMiddleware, checkUserForOwner,
    commentsController.deleteCommentById.bind(commentsController))

commentsRouter.put('/:commentId', authTokenMiddleware,
    contentCommentBodyValid, checkErrorsValidation, checkUserForOwner,
    commentsController.updateCommentById.bind(commentsController))

commentsRouter.put('/:id/like-status', authTokenMiddleware, searchCommentByIdValidation,
    LikeValid, checkErrorsValidation,
    commentsController.makeLikeOrUnlike.bind(commentsController))