import {ObjectId} from 'mongodb'
import jwt from 'jsonwebtoken'
import {settings} from '../settings'

export const jwtUtility = {

    async createJWT(userId: string, expiresTime: string) {
        const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: expiresTime})
        return token
    },
    async createRefreshJWT(userId: string, deviceId: string, expiresTime: string) {
        const token = jwt.sign({userId, deviceId}, settings.JWT_SECRET, {expiresIn: expiresTime})
        return token
    },
    async extractUserIdFromToken(token: string): Promise<ObjectId | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        } catch (error) {
            return null
        }
    }
}