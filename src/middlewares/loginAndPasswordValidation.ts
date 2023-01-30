import {NextFunction, Request, Response} from "express";
import {AuthService} from "../domain/auth-service";
import {myContainer} from "../composition-root";

export const loginAndPasswordValidation =  async (req: Request, res: Response, next: NextFunction) => {
    const authService = myContainer.resolve(AuthService)
    const user = await authService.checkCredentials(req.body.login)
    if (!user) {
        return res.status(401).send('Authentication required.')
    }
    const password = await authService.isPasswordCorrect(req.body.password, user.accountData.passwordHash)
    if (!password) {
        return res.status(401).send('Authentication required.')
    }
    next()
}