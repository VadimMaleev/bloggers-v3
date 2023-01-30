import nodemailer from "nodemailer";

export const emailAdapter = {
    async sendEmail(email: string, code: string) {
        const transporter = nodemailer.createTransport(({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'shvs1510@gmail.com',
                pass: 'cvoacomnpbqvpqju'
            }
        }));

        let info = await transporter.sendMail({
            from: '"Vladislav" <shvs1510@gmail.com>',
            to: email,
            subject: "Confirmation code",
            html: "<div><a href=\"https://some-front.com/confirm-registration?code=" + code + "\">Confirmation code</a></div>",
        });
    },
    async sendEmailRecoveryCode(email: string, code: string) {
        const transporter = nodemailer.createTransport(({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'shvs1510@gmail.com',
                pass: 'cvoacomnpbqvpqju'
            }
        }));

        let info = await transporter.sendMail({
            from: '"Vladislav" <shvs1510@gmail.com>',
            to: email,
            subject: "Confirmation code",
            html: "<a href='https://somesite.com/password-recovery?recoveryCode=" + code + "'>recovery password</a>"
        });
    }
}