import {injectable} from "inversify";
import {UserClass, UsersPagType} from "../types/types";
import {UsersModel} from "../schemas/mongoose-schemas";
import {ObjectId} from "mongodb";

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

    async findUserByEmail (email: string): Promise<UserClass | null> {
        return UsersModel.findOne({email: email})
    }

    async findUserByLogin (login: string): Promise<UserClass | null> {
        return UsersModel.findOne({login: login})
    }

    async findUserById(userId: ObjectId): Promise<UserClass | null> {
        return UsersModel.findOne({id: userId})
    }

    async findUserByCode (code: string):Promise<UserClass | null> {
        return UsersModel.findOne({confirmationCode: code})
    }
}