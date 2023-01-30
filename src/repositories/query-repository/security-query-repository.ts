import {injectable} from "inversify";
import {ObjectId} from "mongodb";
import {RefreshTokenDBType, RefreshTokenResponseType, ReturnSecurityDeviceType} from "../types";
import {RefreshToken} from "../db";

@injectable()
export class SecurityQueryRepository {

    async getActiveSessionCurrentUser(userId: ObjectId): Promise<RefreshTokenResponseType[]> {
        const activeSession: RefreshTokenDBType[] = await RefreshToken.find({userId: userId}).lean()
        const activeSessionResponse: RefreshTokenResponseType[] = activeSession.map(session => ({
            ip: session.ip,
            title: session.deviceName,
            lastActiveDate: session.lastActiveDate,
            deviceId: session.deviceId
        }))
        return activeSessionResponse
    }
}