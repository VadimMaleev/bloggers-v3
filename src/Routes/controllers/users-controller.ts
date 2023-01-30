import {injectable} from "inversify";
import {UsersService} from "../../domain/users-service";
import {Request, Response} from "express";
import {UserRepType, UserType} from "../../repositories/types";

@injectable()
export class UsersController {
    constructor(protected usersService: UsersService) {
    }

    async getUsers(req: Request, res: Response) {
        const pageNumber: number = Number(req.query.PageNumber) || 1
        const pageSize: number = Number(req.query.PageSize) || 10
        const users: UserRepType | undefined = await this.usersService.getUsers(pageNumber, pageSize)
        res.status(200).send(users)
    }

    async createUser(req: Request, res: Response) {
        const newUser: UserType = await this.usersService.createUser(req.body.login, req.body.password, req.body.email)
        res.status(201).send(newUser)
    }

    async deleteUserById(req: Request, res: Response) {
        const userDeleted: boolean = await this.usersService.deleteUserById(req.params.id)
        if (userDeleted) {
            res.sendStatus(204)
        } else res.sendStatus(404)
    }
}