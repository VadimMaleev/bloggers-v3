import {injectable} from "inversify";
import jwt from 'jsonwebtoken'
import {UserClass} from "../types/types";
import {settings} from "../settings/settings";
import {ObjectId} from "mongodb";

@injectable()

export class JWTService {
    constructor(

    ) {
    }

    async createJWT(user: UserClass) {
        return jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: '10d'})
    }

    async extractUserIdFromToken(token: string): Promise<ObjectId | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            console.log({userid: result.userId})
            return result.userId
        } catch (error) {
            return null
        }
    }
}