import {container} from "../composition-root";
import {NextFunction, Request, Response} from "express";
import {UsersQueryRepository} from "../repositories/users-query-repository";
import {JWTService} from "../bll/jwt-service";
import {ObjectId} from "mongodb";

export const jwtAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }
    const usersQueryRepository = container.resolve(UsersQueryRepository)
    const jwtService = container.resolve(JWTService)
    const token = req.headers.authorization.split(' ')[1]
    const _userId = await jwtService.extractUserIdFromToken(token)
    if(_userId) {
        const userId = new ObjectId(_userId)
        req.user = await usersQueryRepository.findUserById(userId)
        if(!req.user) return res.sendStatus(401)
        next()
    } else {
        return res.sendStatus(401)
    }
}

export const jwtRefreshAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshTokenFromCookie = req.cookies?.refreshToken
    if (!refreshTokenFromCookie) {
        res.status(401).send('cookies is not exist')
        return
    }

    const usersQueryRepository = container.resolve(UsersQueryRepository)
    const jwtService = container.resolve(JWTService)
    const result = await jwtService.findExpiredToken(refreshTokenFromCookie)
    if (result?.refreshToken) {
        return res.status(401).send("token is expired")
    } else {
        const _userId = await jwtService.extractUserIdFromToken(refreshTokenFromCookie)
        if(_userId) {
            const userId = new ObjectId(_userId)
            req.user = await usersQueryRepository.findUserById(userId)
            next()
        } else {
            return res.status(401).send("user not exist")
        }
    }
}