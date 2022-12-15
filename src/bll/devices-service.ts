import {inject, injectable} from "inversify";
import {ObjectId} from "mongodb";
import {JWTService} from "./jwt-service";
import {DevicesRepository} from "../repositories/devices-repository";

@injectable()

export class DevicesService {
    constructor(
        @inject('js') protected jwtService: JWTService,
        @inject('dr') protected devicesRepository: DevicesRepository
    ) {
    }

   async deleteDevice (userId: ObjectId, deviceId: string): Promise<boolean> {
       return await this.devicesRepository.deleteDevice(userId, deviceId)
   }


    async updateLastActiveDateByDeviceIdAndUserId(deviceId: string) {
        return await this.devicesRepository.updateLastActiveDateByDeviceIdAndUserId(deviceId)
    }

    async deleteAllDevices(userId: ObjectId, deviceId: string) {
        await this.devicesRepository.deleteAllDevices(userId, deviceId)
    }
}