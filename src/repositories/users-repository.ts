import {injectable} from "inversify";
import {UserClass} from "../types";
import {UsersModel} from "../schemas/mongoose-schemas";
import {ObjectId} from "mongodb";

@injectable()

export class UsersRepository {
    constructor(

    ) {
    }

    async createUser (newUser: UserClass) {
        const userInstance = new UsersModel(newUser)
        await userInstance.save()
    }

    async deleteUser(id: ObjectId): Promise<boolean> {
        const userInstance = await UsersModel.findOne({id: id})
        if(!userInstance) return false
        await userInstance.deleteOne()
        return true
    }
}