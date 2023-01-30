import {Router} from "express";
import {myContainer} from "../composition-root";
import {SecurityController} from "./controllers/security-controller";
export const securityRouter = Router({})

const securityController = myContainer.resolve(SecurityController)

securityRouter.get('/devices',
    securityController.getActiveSessionCurrentUser.bind(securityController))

securityRouter.delete('/devices',
    securityController.terminateAllSessionExcludeCurrent.bind(securityController))

securityRouter.delete('/devices/:deviceId',
    securityController.terminateSpecificDeviceSession.bind(securityController))