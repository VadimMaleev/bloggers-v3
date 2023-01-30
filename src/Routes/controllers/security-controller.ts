import {injectable} from "inversify";
import {Request, Response} from "express";
import {SecurityService} from "../../domain/security-service";
import {SecurityQueryRepository} from "../../repositories/query-repository/security-query-repository";
import {jwtUtility} from "../../application/jwt-utility";
import {extractDeviceIdFromRefreshToken} from "../../helpers/extractDeviceIdFromRefreshToken";

@injectable()
export class SecurityController {

    constructor(protected securityService: SecurityService,
                protected securityQueryRepository: SecurityQueryRepository) {
    }

    async getActiveSessionCurrentUser(req: Request, res: Response) {
        const refreshToken = req.cookies?.refreshToken
        const userId = await jwtUtility.extractUserIdFromToken(refreshToken)
        if (!userId) return res.sendStatus(401)
        const result = await this.securityQueryRepository.getActiveSessionCurrentUser(userId)
        res.json(result).status(200)
    }

    async terminateAllSessionExcludeCurrent(req: Request, res: Response) {
        const refreshToken = req.cookies?.refreshToken
        if (!refreshToken) return res.sendStatus(401)
        const userId = await jwtUtility.extractUserIdFromToken(refreshToken)
        const deviceId = extractDeviceIdFromRefreshToken(refreshToken)
        if (!userId || !deviceId) return res.sendStatus(401)
        await this.securityService.terminateAllSessionExceptThis(userId, deviceId)
        res.sendStatus(204)
    }

    async terminateSpecificDeviceSession(req: Request, res: Response) {
        const refreshToken = req.cookies?.refreshToken
        if (!refreshToken) return res.sendStatus(401)
        const userId = await jwtUtility.extractUserIdFromToken(refreshToken)
        if (!userId) return res.sendStatus(401)
        const deviceId = req.params.deviceId
        const sessionByDeviceId = await this.securityService.findSessionByDeviceId(deviceId)
        if (!sessionByDeviceId) return res.sendStatus(404)
        const result = await this.securityService.terminateSpecificDeviceSession(deviceId, userId)
        if (result) return res.sendStatus(204)
        if (sessionByDeviceId.userId !== userId.toString()) return res.sendStatus(403)

    }

}