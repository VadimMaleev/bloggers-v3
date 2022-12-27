import "reflect-metadata"
import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {AuthService} from "../../bll/auth-service";
import {UsersQueryRepository} from "../../repositories/users-query-repository";
import {UsersService} from "../../bll/users-service";
import {JWTService} from "../../bll/jwt-service";
import {DevicesService} from "../../bll/devices-service";

@injectable()

export class AuthController {
    constructor(
        @inject('uqr') protected usersQueryRepository: UsersQueryRepository,
        @inject('as') protected authService: AuthService,
        @inject('us') protected usersService: UsersService,
        @inject('js')protected jwtService: JWTService,
        @inject('ds') protected devicesService: DevicesService
    ) {
    }


    async login (req: Request, res: Response) {
        const user = await this.authService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (!user) return res.sendStatus(401)
        const accessToken = await this.authService.createToken(user)
        const refreshToken = await this.authService.createRefreshToken(user, req.ip, req.headers["user-agent"])
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true
        })
        res.status(200).send({accessToken})
    }

    async registration (req: Request, res: Response) {
        const userEmail = await this.usersQueryRepository.findUserByEmail(req.body.email)
        if (userEmail) {
            return res.status(400).send({errorsMessages: [{message: "user does exist", field: "email"}]})
        }
        const userLogin = await this.usersQueryRepository.findUserByLogin(req.body.login)
        if (userLogin) {
            return res.status(400).send({errorsMessages: [{message: "user does exist", field: "login"}]})
        }
        const user = await this.authService.createUser(req.body.login, req.body.password, req.body.email)
        res.status(204).send(user)
    }

    async passwordRecovery (req: Request, res: Response) {
        const user = await this.usersQueryRepository.findUserByEmail(req.body.email)
        if (!user) return res.sendStatus(204)
        await this.authService.passwordRecovery(user)
        return res.sendStatus(204)
    }

    async newPassword (req: Request, res: Response) {
        const result = await this.authService.newPassword(req.body.newPassword, req.body.recoveryCode)
        if (!result) return res.status(400).send({
            errorsMessages: [
                {
                    message: "confirm code error",
                    field: "recoveryCode"
                }
            ]
        })
        return res.sendStatus(204)
    }

    async confirmation (req: Request, res: Response) {
        const result = await this.usersService.confirmUser(req.body.code)
        if (result) {
            return res.sendStatus(204)
        } else {
            res.status(400).send({
                errorsMessages: [
                    {
                        message: "confirm code error",
                        field: "code"
                    }
                ]
            })
        }
    }

    async emailResending (req: Request, res: Response) {
        const user = await this.usersQueryRepository.findUserByEmail(req.body.email)
        if (user && user.isConfirmed) {
            return res.status(400).send({errorsMessages: [{message: "user confirmed now", field: "email"}]})
        }
        if (!user) {
            return res.status(400).send({errorsMessages: [{message: "email does not exist", field: "email"}]})
        } else {
            await this.usersService.createNewConfirmCode(user)
            return res.sendStatus(204)
        }
    }

    async refreshToken (req: Request, res: Response) {
        const user = req.user!
        const oldRefreshToken = req.cookies.refreshToken!
        const accessToken = await this.authService.createToken(user)
        const refreshToken = await this.authService.refreshToken(user, oldRefreshToken)
        if (!refreshToken) return res.sendStatus(401)
        res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true
        })
        res.status(200).send({accessToken})

    }

    async logout(req: Request, res: Response) {
        const user = req.user!
        const oldRefreshToken = req.cookies.refreshToken!
        const isLogout = await this.authService.logout(user, oldRefreshToken)
        return isLogout ? res.sendStatus(204) : res.sendStatus(401)
    }

    async aboutMe (req: Request, res: Response) {
        const user = {
            email: req.user!.email,
            login: req.user!.login,
            userId: req.user!.id
        }
        res.status(200).send(user)
    }
}