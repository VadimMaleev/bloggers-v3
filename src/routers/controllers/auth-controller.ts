import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {AuthService} from "../../bll/auth-service";
import {UsersQueryRepository} from "../../repositories/users-query-repository";
import {UsersService} from "../../bll/users-service";

@injectable()

export class AuthController {
    constructor(
        @inject('uqr') protected usersQueryRepository: UsersQueryRepository,
        @inject('as') protected authService: AuthService,
        @inject('us') protected usersService: UsersService
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
        const checkCredentials = await this.authService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (!checkCredentials) return res.status(401).send('auth required')
        const accessToken = await this.authService.createToken(req.body.loginOrEmail)
        if(accessToken === null) res.sendStatus(400)
        return res.status(200).send(accessToken)
    }

    async registration (req: Request, res: Response) {
        const userEmail = await this.usersQueryRepository.findUserByEmail(req.body.email)
        const userLogin = await this.usersQueryRepository.findUserByLogin(req.body.login)
        if (userEmail) {
            return res.status(400).send({errorsMessages: [{message: "user does exist", field: "email"}]})
        }
        if (userLogin) {
            return res.status(400).send({errorsMessages: [{message: "user does exist", field: "login"}]})
        }

        const user = await this.usersService.createUser(req.body.login, req.body.password, req.body.email)
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

    async aboutMe (req: Request, res: Response) {
        const user = {
            email: req.user!.email,
            login: req.user!.login,
            userId: req.user!.id
        }
        res.status(200).send(user)
    }
}