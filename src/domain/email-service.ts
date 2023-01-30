import {emailManager} from "../managers/email-manager";
import {injectable} from "inversify";

@injectable()
export class EmailService{
    async sendEmail(email: string, confirmationCode: string) {
        await emailManager.sendEmail(email, confirmationCode)
    }
    async sendEmailRecoveryCode(email: string, confirmationCode: string) {
        await emailManager.sendEmailRecoveryCode(email, confirmationCode)
    }
}