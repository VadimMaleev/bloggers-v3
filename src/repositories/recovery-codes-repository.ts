import {injectable} from "inversify";
import {RecoveryCodeClass} from "../types/types";
import {RecoveryCodesModel} from "../schemas/mongoose-schemas";

@injectable()

export class RecoveryCodesRepository {
    constructor(

    ) {
    }


    async createRecoveryCode(recoveryCode: RecoveryCodeClass) {
        const recoveryCodeInstance = new RecoveryCodesModel(recoveryCode)
        await recoveryCodeInstance.save()
    }

    async findCode(recoveryCode: string): Promise<RecoveryCodeClass> {
        return RecoveryCodesModel.findOne({code: recoveryCode})
    }
}