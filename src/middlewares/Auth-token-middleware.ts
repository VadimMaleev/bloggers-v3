import {NextFunction, Request, Response} from "express";
import {jwtUtility} from "../application/jwt-utility";
import {UserModel} from "../repositories/db";

export const authTokenMiddleware =  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
       return res.sendStatus(401)
    }
    const token: string = req.headers.authorization.split(' ')[1]
    const userId = await jwtUtility.extractUserIdFromToken(token)
    if(!userId) return res.status(401).send('Authentication required.')
    const user = await UserModel.findOne({_id: String(userId)}).lean()
    if (user) {
        return next()
    }
    res.status(401).send('Authentication required.')
}