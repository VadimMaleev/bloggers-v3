import {NextFunction, Request, Response} from "express";
import {jwtUtility} from "../application/jwt-utility";
import {UsersService} from "../domain/users-service";
import {myContainer} from "../composition-root";

export const checkAccessToken =  async (req: Request, res: Response, next: NextFunction) => {
    const usersService = myContainer.resolve(UsersService)
    if (!req.body.accessToken) return res.sendStatus(401)
    const userId = await jwtUtility.extractUserIdFromToken(req.body.accessToken)
    if (!userId) return res.sendStatus(401)
    const user = await usersService.findUserById(userId)
    if(!user) return res.sendStatus(401)
    next()
}