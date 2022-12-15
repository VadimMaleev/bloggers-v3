import {inject, injectable} from "inversify";
import {DevicesQueryRepository} from "../../repositories/devices-query-repository";
import {Request, Response} from "express";
import {DevicesService} from "../../bll/devices-service";

@injectable()

export class DevicesController {
    constructor(
        @inject('dqr') protected devicesQueryRepository: DevicesQueryRepository,
        @inject('ds') protected devicesService: DevicesService
    ) {
    }

    async findDevicesForUser (req: Request, res: Response) {
        const devices = await this.devicesQueryRepository.findDevicesForUser(req.user.id)
        return res.status(200).send(devices)
    }

    async deleteAllDevices (req: Request, res: Response) {
        await this.devicesService.deleteAllDevices(req.user.id, req.device.deviceId)
        return res.sendStatus(204)
    }

    async deleteDevice (req: Request, res: Response) {
        if (req.user.id !== req.device.userId) return res.sendStatus(403)
        const isDeleted = this.devicesService.deleteDevice(req.user.id, req.device.deviceId)
        if (!isDeleted) return res.sendStatus(404)
        return res.sendStatus(204)
    }

}