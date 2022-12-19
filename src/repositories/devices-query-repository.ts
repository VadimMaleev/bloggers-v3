import {injectable} from "inversify";
import {ObjectId} from "mongodb";
import {DeviceClass} from "../types/types";
import {DevicesModel} from "../schemas/mongoose-schemas";

@injectable()

export class DevicesQueryRepository {
    constructor(

    ) {
    }


    async findDevicesForUser(userId: ObjectId): Promise<DeviceClass[]> {
        return DevicesModel.find({userId: userId}, {_id:0, userId: 0}).lean()
    }

    async findDeviceByDeviceAndUserId(deviceId:string, userId: ObjectId): Promise<DeviceClass | null> {
        return DevicesModel.findOne({userId, deviceId})
    }

    async findDeviceByDeviceAndUserIdAndDate(deviceId:string, userId: ObjectId, lastActiveDate: string): Promise<DeviceClass | null> {
        return DevicesModel.findOne({userId, deviceId, lastActiveDate})
    }

    async findDeviceByDeviceIdAndDate(deviceId:string, lastActiveDate: string): Promise<DeviceClass | null> {
        return DevicesModel.findOne({deviceId, lastActiveDate})
    }
}