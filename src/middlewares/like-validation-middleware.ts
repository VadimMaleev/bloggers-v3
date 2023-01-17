import {Request, NextFunction, Response} from "express";
import {body} from "express-validator";

export function likeValidationMiddleware(req: Request, res: Response, next: NextFunction) {
    const likeStatus = req.body.likeStatus
    if (likeStatus === "Like" || likeStatus === "Dislike" || likeStatus === "None") {
        return next()
    }
    return res.status(400).send({
        "errorsMessages": [
            {
                message: "string",
                field: "likeStatus"
            }
        ]
    })
}

export const likeInputValidation = body('likeStatus').notEmpty().isString().isLength({min: 4, max: 9})
