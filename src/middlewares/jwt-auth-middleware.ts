import {container} from "../composition-root";
import {NextFunction, Request, Response} from "express";
import {UsersQueryRepository} from "../repositories/users-query-repository";
import {JWTService} from "../bll/jwt-service";
import {ObjectId} from "mongodb";
import {DevicesRepository} from "../repositories/devices-repository";

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
    const usersQueryRepository = container.resolve(UsersQueryRepository)
    const jwtService = container.resolve(JWTService)
    const devicesRepository = container.resolve(DevicesRepository)

    const refreshTokenFromCookie = req.cookies.refreshToken

    if (!refreshTokenFromCookie) {
        res.sendStatus(401)
        return
    }

    const payload = await jwtService.extractPayloadFromToken(refreshTokenFromCookie)
    if (!payload) return res.sendStatus(401)

    const user = await usersQueryRepository.findUserById(payload.userId)
    if (!user) return res.sendStatus(401)

    const device = await devicesRepository.findDeviceByDeviceAndUserId(payload.deviceId, user.id)
    if (!device) return res.sendStatus(401)

    req.user = user
    req.device = device
    return next()

}