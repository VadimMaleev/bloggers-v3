import {inject, injectable} from "inversify";
import jwt from 'jsonwebtoken'
import {UserClass} from "../types/types";
import {settings} from "../settings/settings";
import {ObjectId} from "mongodb";
import {JwtRepository} from "../repositories/jwt-repository";


@injectable()

export class JWTService {
    constructor(
        @inject('jr') protected jwtRepository: JwtRepository,
    ) {
    }

    async createJWT(user: UserClass) {
        return jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: '5m'})
    }

    async createRefreshJWT(user: UserClass, deviceId: string) {

        return jwt.sign({userId: user.id, deviceId: deviceId}, settings.JWT_SECRET, {expiresIn: '10m'})

    }

     getLastActiveDateFromRefreshToken(refreshToken: string): string {
        const payload: any = jwt.decode(refreshToken)
        return new Date(payload.iat * 1000).toISOString()
    }


    async extractUserIdFromToken(token: string): Promise<ObjectId | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        } catch (error) {
            return null
        }
    }

    async extractPayloadFromToken(token: string): Promise<any> {
        try {
            return jwt.verify(token, settings.JWT_SECRET)
        } catch (error) {
            return null
        }
    }
}