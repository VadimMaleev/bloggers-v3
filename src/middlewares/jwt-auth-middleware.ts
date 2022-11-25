import {container} from "../composition-root";
import {NextFunction, Request, Response} from "express";
import {UsersQueryRepository} from "../repositories/users-query-repository";
import {JWTService} from "../bll/jwt-service";
import {ObjectId} from "mongodb";

export const jwtAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.send(401)
        return
    }
    const usersQueryRepository = container.resolve(UsersQueryRepository)
    const jwtService = container.resolve(JWTService)
    const token = req.headers.authorization.split(' ')[1]
    const _userId = await jwtService.extractUserIdFromToken(token)
    if(_userId) {
        const userId = new ObjectId(_userId)
        req.user = await usersQueryRepository.findUserById(userId)
        console.log(req.user)
        next()
    } else {
        return res.send(401)
    }
}