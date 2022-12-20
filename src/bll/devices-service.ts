import {inject, injectable} from "inversify";
import {ObjectId} from "mongodb";
import {JWTService} from "./jwt-service";
import {DevicesRepository} from "../repositories/devices-repository";
import {DevicesQueryRepository} from "../repositories/devices-query-repository";

@injectable()

export class DevicesService {
    constructor(
        @inject('js') protected jwtService: JWTService,
        @inject('dr') protected devicesRepository: DevicesRepository,
        @inject('dqr') protected devicesQueryRepository: DevicesQueryRepository
    ) {
    }


    async deleteAllDevicesExceptCurrent(userId: ObjectId, oldRefreshToken: string) {
        const jwtPayload = await this.jwtService.extractPayloadFromToken(oldRefreshToken)
        const deviceId = jwtPayload.deviceId
        const lastActiveDate = new Date(jwtPayload.iat * 1000).toISOString()
        const device = await this.devicesQueryRepository.findDeviceByDeviceAndUserIdAndDate(deviceId, userId, lastActiveDate)
        if (!device) return false
        return this.devicesRepository.deleteAllDevicesExceptCurrent(userId, deviceId)
    }

    async deleteDeviceById(userId: ObjectId, deviceId: string): Promise<number> {
        const device = await this.devicesQueryRepository.findDeviceByDeviceId(deviceId)
        if (!device) return 404
        if (device.userId.toHexString() !== userId.toHexString()) return 403
        const isDeleted = await this.devicesRepository.deleteDevice(device)
        console.log('deleteDeviceById => isDeleted', isDeleted)
        if (!isDeleted) return 404
        return 204
    }
}