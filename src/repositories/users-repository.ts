import {injectable} from "inversify";
import {UserClass} from "../types/types";
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

    async updateConfirmation(id: ObjectId) {
        const confirmationInstance =  await UsersModel.findOne({id: id})
        if (!confirmationInstance) return false

        confirmationInstance.isConfirmed = true

        await confirmationInstance.save()
        return true
    }

    async updateConfirmCode(user: UserClass, confirmCode: string, expirationDate: Date) {
        const confirmationInstance = await UsersModel.findOne({id: user.id})
        if (!confirmationInstance) return null

        confirmationInstance.confirmationCode = confirmCode
        confirmationInstance.codeExpirationDate = expirationDate

        await confirmationInstance.save()
    }

    async deleteUser(id: ObjectId): Promise<boolean> {
        const userInstance = await UsersModel.findOne({id: id})
        if(!userInstance) return false
        await userInstance.deleteOne()
        return true
    }

    async updatePassword(newPasswordHash: string, userId: ObjectId): Promise<boolean> {
        const userInstance: UserClass = await UsersModel.findOne({id: userId})
        if(!userInstance) return false

        userInstance.passwordHash = newPasswordHash
        return true
    }
}