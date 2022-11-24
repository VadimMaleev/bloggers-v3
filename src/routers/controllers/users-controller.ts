import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {UsersQueryRepository} from "../../repositories/users-query-repository";
import {UsersService} from "../../bll/users-service";
import {ObjectId} from "mongodb";

@injectable()

export class UsersController {
    constructor(
        @inject('uqr') protected usersQueryRepository: UsersQueryRepository,
        @inject('us') protected usersService: UsersService
    ) {
    }

    async getUsers (req: Request, res: Response) {
        const page = isNaN(Number(req.query.pageNumber)) ? 1 : +req.query.pageNumber!
        const pageSize = isNaN(Number(req.query.pageSize)) ? 10 : +req.query.pageSize!
        const sortBy = req.query.sortBy?.toString() || "createdAt"
        let sortDirection: "desc" | "asc" = "desc"
        if (req.query.sortDirection && req.query.sortDirection === "asc") {
            sortDirection = "asc"
        }
        const login = req.query.loginSearchTerm?.toString() || ''
        const email = req.query.emailSearchTerm?.toString() || ''

        const users = await this.usersQueryRepository.getUsers(login, email, page, pageSize, sortBy, sortDirection)
        return res.status(200).send(users)
    }

    async createUser (req: Request, res: Response) {
        const newUser = await this.usersService.createUser(req.body.login, req.body.password, req.body.email)
        res.status(201).send(newUser)
    }

    async deleteUser (req: Request, res: Response) {
        try {
            const isDeleted = await this.usersService.deleteUser(new ObjectId(req.params.id))
            if (isDeleted) {
                res.sendStatus(204)
            } else {
                res.sendStatus(404)
            }
        } catch (e) {
            return res.sendStatus(404)
        }
    }
}