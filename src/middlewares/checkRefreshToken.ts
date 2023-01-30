import {NextFunction, Request, Response} from "express";
import {AuthService} from "../domain/auth-service";
import {jwtUtility} from "../application/jwt-utility";
import {UsersService} from "../domain/users-service";
import {myContainer} from "../composition-root";

export const checkRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const usersService = myContainer.resolve(UsersService)
    const authService = myContainer.resolve(AuthService)
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) return res.sendStatus(401)
    const userId = await jwtUtility.extractUserIdFromToken(refreshToken)
    if (!userId) return res.sendStatus(401)
    const user = await usersService.findUserById(userId)
    if (!user) return res.sendStatus(401)
    const refreshTokenInBlackList = await authService.findRefreshTokenInBlackList(refreshToken)
    if(refreshTokenInBlackList) return res.sendStatus(401)
    next()
}