import {emailAdapter} from "../adapters/email-adapter";

export const emailManager = {
    async sendEmail(email: string, confirmationCode: string) {
        await emailAdapter.sendEmail(email, confirmationCode)
    },
    async sendEmailRecoveryCode(email: string, confirmationCode: string) {
        await emailAdapter.sendEmailRecoveryCode(email, confirmationCode)
    }
}