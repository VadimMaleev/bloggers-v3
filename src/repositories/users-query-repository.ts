import {injectable} from "inversify";
import {UsersPagType} from "../types";
import {UsersModel} from "../schemas/mongoose-schemas";

@injectable()

export class UsersQueryRepository {
    constructor() {
    }

    async getUsers (login: string, email: string, page: number, pageSize: number, sortBy: string, sortDirection: "asc" | "desc"): Promise<UsersPagType> {
        let query = []
        if (login) {
            query.push({'login': {$regex: `(?i)(${login})`}})
        }
        if (email) {
            query.push({'email': {$regex: `(?i)(${email})`}})
        }
        console.log(email, login)
        const queryFetch = query.length ? {$or: query} : {}

        const items = await UsersModel.find( queryFetch, {_id: 0, passwordHash: 0})
            .sort({[sortBy]: sortDirection})
            .skip((page - 1) * pageSize).limit(pageSize).lean()

        return {
            pagesCount: Math.ceil(await UsersModel.count(queryFetch) / pageSize),
            page: page,
            pageSize: pageSize,
            totalCount: await UsersModel.count(queryFetch),
            items
        }
    }

    async findUserByLoginOrEmail (loginOrEmail: string) {
        return UsersModel.findOne({$or: [{'login': loginOrEmail}, {'email': loginOrEmail}]})
    }
}