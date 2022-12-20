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
        const refreshToken = req.cookies.refreshToken
        const isDeleted = await this.devicesService.deleteAllDevicesExceptCurrent(req.user.id, refreshToken)
        return isDeleted ? res.sendStatus(204) : res.sendStatus(401)
    }

    async deleteDevice (req: Request, res: Response) {
        const status = await this.devicesService.deleteDeviceById(req.user.id, req.params.id)
        return res.sendStatus(status)
    }

}