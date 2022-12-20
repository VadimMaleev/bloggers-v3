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

    async updateLastActiveDateByDeviceAndUserId(deviceId: string, userId: ObjectId, newLastActiveDate: string): Promise<boolean> {
        try {
            await DevicesModel.findOneAndUpdate({deviceId: deviceId, userId}, {$set: {lastActiveDate: newLastActiveDate}})
            return true
        } catch (e) {
            return false
        }

    }

    async findAndDeleteDeviceByDeviceAndUserIdAndDate(userId: ObjectId, deviceId: string, lastActiveDate: string): Promise<boolean> {
        const deviceInstance = DevicesModel.findOne({userId, deviceId, lastActiveDate})
        if (!deviceInstance) return false
        await deviceInstance.deleteOne()
        return true
    }


    async deleteAllDevicesExceptCurrent(userId: ObjectId, deviceId: string): Promise<boolean> {
        try {
            await DevicesModel.deleteMany({userId, deviceId: {$ne: deviceId}})
            return true
        } catch (e) {
            return false
        }
    }

    async deleteDevice(device: DeviceClass): Promise<boolean> {
        try {
            await DevicesModel.deleteOne(device)
            return true
        } catch (e) {
            return false
        }
    }
}