import {NextFunction, Request, Response} from "express";
import {errorMessage} from "../helpers/helper";

export const likeStatusValidation =  (req: Request, res: Response, next: NextFunction) => {
    const likeStatus = req.body.likeStatus
    if(likeStatus === "Like" || likeStatus === "Dislike" || likeStatus === "None") {
        return next()
    }
    return res.status(400).json(errorMessage("likeStatus"))
}
