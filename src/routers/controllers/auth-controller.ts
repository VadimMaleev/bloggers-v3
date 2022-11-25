import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {AuthService} from "../../bll/auth-service";
import {UsersQueryRepository} from "../../repositories/users-query-repository";

@injectable()

export class AuthController {
    constructor(
        @inject('uqr') protected usersQueryRepository: UsersQueryRepository,
        @inject('as') protected authService: AuthService
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

    async aboutMe (req: Request, res: Response) {
        const user = {
            email: req.user!.email,
            login: req.user!.login,
            userId: req.user!.id
        }
        res.status(200).send(user)
    }
}