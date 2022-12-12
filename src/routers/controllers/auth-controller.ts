import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {AuthService} from "../../bll/auth-service";
import {UsersQueryRepository} from "../../repositories/users-query-repository";
import {UsersService} from "../../bll/users-service";
import {JWTService} from "../../bll/jwt-service";

@injectable()

export class AuthController {
    constructor(
        @inject('uqr') protected usersQueryRepository: UsersQueryRepository,
        @inject('as') protected authService: AuthService,
        @inject('us') protected usersService: UsersService,
        @inject('js')protected jwtService: JWTService
    ) {
    }

    // async login (req: Request, res: Response) {
    //     const user = await this.usersQueryRepository.findUserByLoginOrEmail(req.body.loginOrEmail)
    //     if (!user) return res.status(401).send('auth required')
    //     const checkPassword = await this.authService.checkPassword(req.body.password, user.passwordHash)
    //     if (!checkPassword) return res.status(401).send('auth required')
    //     return res.sendStatus(204)
    // }

    async login (req: Request, res: Response) {
        const user = await this.authService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (!user) return res.sendStatus(401)
        const accessToken = await this.authService.createToken(user)
        const refreshToken = await this.authService.createRefreshToken(user)
        return res.status(200).cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true
        }).send({accessToken})
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

    async createTokens (req: Request, res: Response) {
        await this.jwtService.expireRefreshToken(req.cookies.refreshToken)
        const accessToken = await this.authService.createToken(req.user!)
        const refreshToken = await this.authService.createRefreshToken(req.user!)

        if (accessToken === null || refreshToken === null) {
            return res.sendStatus(400)
        } else {
            return res.status(200).cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true
            }).send(accessToken)
        }
    }

    async logout(req: Request, res: Response) {
        await this.jwtService.expireRefreshToken(req.cookies.refreshToken)
        return res.sendStatus(204)
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