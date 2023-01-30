import {injectable} from "inversify";
import {ObjectId} from "mongodb";
import {RefreshToken} from "../repositories/db";
import {RefreshTokenDBType} from "../repositories/types";

@injectable()
export class SecurityService {
    async terminateAllSessionExceptThis(userId: ObjectId, deviceId: string): Promise<void> {
        await RefreshToken.deleteMany({userId: userId, deviceId: {$ne: deviceId}});
    }

    async terminateSpecificDeviceSession(deviceId: string, userId: ObjectId): Promise<boolean> {
        const deleteSession = await RefreshToken.deleteMany({userId: userId, deviceId: deviceId})
        return deleteSession.deletedCount > 0
    }

    async findSessionByDeviceId(deviceId: string): Promise<RefreshTokenDBType | null> {
        const sessionsByDeviceCount: number = await RefreshToken.count({deviceId: deviceId}).lean()
        if(sessionsByDeviceCount === 0) return null
        const sessionsByDevice: RefreshTokenDBType = await RefreshToken.find({deviceId: deviceId}).lean()
        return sessionsByDevice
    }


}