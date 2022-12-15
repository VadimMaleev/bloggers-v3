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
        return jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: '10m'})
    }

    async createRefreshJWT(user: UserClass, deviceId: string) {

        return jwt.sign({userId: user.id, deviceId: deviceId}, settings.JWT_SECRET, {expiresIn: '20m'})

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

    // async extractDeviceIdFromRefreshToken(refreshToken: string): Promise<string | null> {
    //     try {
    //         const result: any = jwt.verify(refreshToken, settings.JWT_SECRET)
    //         return result.deviceId
    //     } catch (error) {
    //         return null
    //     }
    // }

    // async expireRefreshToken(refreshToken: string) {
    //     const token = {
    //         _id: new ObjectId,
    //         refreshToken: refreshToken
    //     }
    //     await this.jwtRepository.expireRefreshToken(token)
    // }

    // async findExpiredToken(token: string): Promise <TokenType | null> {
    //     return await this.jwtRepository.findAllExpiredTokens(token)
    // }
}