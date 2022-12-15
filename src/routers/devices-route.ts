import {Router} from "express";
import {container} from "../composition-root";
import {DevicesController} from "./controllers/devices-controller";
import {jwtRefreshAuthMiddleware} from "../middlewares/jwt-auth-middleware";

export const devicesRouter = Router({})

const devicesController = container.resolve(DevicesController)

const findDevicesForUser = devicesController.findDevicesForUser.bind(devicesController)
const deleteAllDevices = devicesController.deleteAllDevices.bind(devicesController)
const deleteDevice = devicesController.deleteDevice.bind(devicesController)

devicesRouter.get('/devices',
    jwtRefreshAuthMiddleware,
    findDevicesForUser)

devicesRouter.delete('/devices',
    jwtRefreshAuthMiddleware,
    deleteAllDevices)

devicesRouter.delete('/devices/:id',
    jwtRefreshAuthMiddleware,
    deleteDevice)