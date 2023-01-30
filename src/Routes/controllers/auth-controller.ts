import {AuthService} from "../../domain/auth-service";
import {EmailService} from "../../domain/email-service";
import {UsersService} from "../../domain/users-service";
import {Request, Response} from "express";
import {errorMessage} from "../../helpers/helper";
import {jwtUtility} from "../../application/jwt-utility";
import {injectable} from "inversify";
import {ObjectId} from "mongodb";
import {extractDeviceIdFromRefreshToken} from "../../helpers/extractDeviceIdFromRefreshToken";

@injectable()
export class AuthController {
    constructor(protected authService: AuthService,
                protected emailService: EmailService,
                protected usersService: UsersService) {
    }

    async login(req: Request, res: Response) {
        if (req.cookies?.refreshToken) {
            await this.authService.addRefreshTokenToBlackList(req.cookies?.refreshToken)
        }
        const newAccessToken = await this.authService.createAccessToken(req.body.login, "600000")
        const newRefreshToken = await this.authService.createRefreshToken(req.body.login, "200000")
        await this.authService.saveRefreshToken(newRefreshToken, req.ip, req.headers["user-agent"])
        res.cookie("refreshToken", newRefreshToken, {httpOnly: true, secure: true, maxAge: 200 * 1000})
            .status(200).json({"accessToken": newAccessToken})
    }

    async registration(req: Request, res: Response) {
        const newAccount = await this.usersService.createUser(req.body.login, req.body.password, req.body.email)
        const user = await this.usersService.findUserById(new ObjectId(newAccount.id))
        if (user!.emailConfirmation.isConfirmed) return res.status(400).send(errorMessage("email"))
        await this.emailService.sendEmail(req.body.email, user!.emailConfirmation.confirmationCode)
        res.sendStatus(204)
    }

    async registrationEmailResending(req: Request, res: Response) {
        const confirmationCode = await this.authService.refreshConfirmationCode(req.body.email)
        const accountIsConfirmed = await this.authService.accountIsConfirmed(req.body.email)
        if (confirmationCode && !accountIsConfirmed) {
            await this.emailService.sendEmail(req.body.email, confirmationCode)
            res.sendStatus(204)
        } else return res.status(400).send(errorMessage("email"))
    }

    async registrationConfirmation(req: Request, res: Response) {
        const userByConfirmationCode = await this.authService.findAccountByConfirmationCode(req.body.code)
        if (!userByConfirmationCode) return res.status(400).send(errorMessage("code"))
        if (userByConfirmationCode.emailConfirmation.isConfirmed) return res.status(400).send(errorMessage("code"))
        const verifiedAccount = await this.authService.confirmAccount(userByConfirmationCode._id)
        if (verifiedAccount) {
            return res.sendStatus(204)
        }
        res.status(400).send(errorMessage("code"))
    }

    async updateRefreshToken(req: Request, res: Response) {
        const oldRefreshToken = req.cookies?.refreshToken
        const userId = await jwtUtility.extractUserIdFromToken(oldRefreshToken)
        await this.authService.addRefreshTokenToBlackList(oldRefreshToken)
        const deviceId = extractDeviceIdFromRefreshToken(oldRefreshToken)
        const newAccessToken = await jwtUtility.createJWT(userId!.toString(), "600000")
        const newRefreshToken = await jwtUtility.createRefreshJWT(userId!.toString(), deviceId!, "200000")
        await this.authService.updateRefreshToken(oldRefreshToken, newRefreshToken, req.ip)
        res.cookie("refreshToken", newRefreshToken, {httpOnly: true, secure: true, maxAge: 200 * 1000})
            .status(200).json({"accessToken": newAccessToken})
    }

    async infoAboutMe(req: Request, res: Response) {
        const token: string = req.headers.authorization!.split(' ')[1]
        const userId = await jwtUtility.extractUserIdFromToken(token)
        const user = await this.usersService.returnInfoAboutMe(userId!)
        res.status(200).json(user)
    }

    async logout(req: Request, res: Response) {
        const refreshToken = req.cookies?.refreshToken
        await this.authService.addRefreshTokenToBlackList(refreshToken)
        await this.authService.deleteRefreshToken(refreshToken)
        res.sendStatus(204)
    }

    async passwordRecovery(req: Request, res: Response) {
        const email = req.body.email
        const user = await this.usersService.findUserByEmail(email)
        if (!user) return res.sendStatus(204)
        await this.emailService.sendEmailRecoveryCode(req.body.email, user!.emailConfirmation.confirmationCode)
        res.sendStatus(204)
    }

    async newPassword(req: Request, res: Response) {
        const userByConfirmationCode = await this.authService.findAccountByConfirmationCode(req.body.recoveryCode)
        if (!userByConfirmationCode) return res.status(400).send(errorMessage("recoveryCode"))
        const hashNewPassword = await this.authService.generateHash(req.body.newPassword)
        await this.authService.changePassword(hashNewPassword, userByConfirmationCode._id)
        res.sendStatus(204)
    }
}