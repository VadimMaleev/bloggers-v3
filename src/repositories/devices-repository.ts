import {injectable} from "inversify";
import {DeviceClass} from "../types/types";
import {DevicesModel} from "../schemas/mongoose-schemas";
import {ObjectId} from "mongodb";

@injectable()

export class DevicesRepository {
    constructor(

    ) {
    }

    async createDevice (device: DeviceClass) {
        const deviceInstance = new DevicesModel(device)
        await deviceInstance.save()
    }

    async deleteDevice(userId: ObjectId, deviceId: string) {
        await DevicesModel.deleteOne({userId: userId, deviceId: deviceId})
    }

    async findDeviceByDeviceAndUserId(deviceId:string, userId: ObjectId) {
        return DevicesModel.findOne({userId, deviceId})
    }

    async updateLastActiveDateByDeviceIdAndUserId(deviceId: string): Promise<boolean> {
        const deviceInstance = await DevicesModel.findOne({deviceId: deviceId})
        if(!deviceInstance) return false
        deviceInstance.lastActiveDate = new Date()
        deviceInstance.save()
    }
}