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

   // async deleteDevice (userId: ObjectId, deviceId: string): Promise<boolean> {
   //     return await this.devicesRepository.findAndDeleteDeviceByDeviceAndUserIdAndDate(userId, deviceId)
   // }
   //
   //
   //  async updateLastActiveDateByDeviceIdAndUserId(deviceId: string) {
   //      return await this.devicesRepository.updateLastActiveDateByDeviceAndUserId(deviceId)
   //  }

    async deleteAllDevicesExceptCurrent(userId: ObjectId, oldRefreshToken: string) {
        const jwtPayload = await this.jwtService.extractPayloadFromToken(oldRefreshToken)
        const deviceId = jwtPayload.deviceId
        const lastActiveDate = new Date(jwtPayload.iat * 1000).toISOString()
        const device = await this.devicesQueryRepository.findDeviceByDeviceAndUserIdAndDate(deviceId, userId, lastActiveDate)
        if (!device) return false
        return this.devicesRepository.deleteAllDevicesExceptCurrent(userId, deviceId)
    }

    async deleteDeviceById(userId: ObjectId, deviceId: string, refreshToken: string): Promise<number> {
        const jwtPayload = await this.jwtService.extractPayloadFromToken(refreshToken)
        const lastActiveDate = new Date(jwtPayload.iat * 1000).toISOString()
        const device = await this.devicesQueryRepository.findDeviceByDeviceIdAndDate(deviceId, lastActiveDate)
        if (!device) return 404
        if (device.userId !== userId) return 403
        const isDeleted = await this.devicesRepository.deleteDevice(device)
        if (!isDeleted) return 404
        return 204
    }
}