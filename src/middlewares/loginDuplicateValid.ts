import {NextFunction, Request, Response} from "express";
import {UsersService} from "../domain/users-service";
import {errorMessage} from "../helpers/helper";
import {myContainer} from "../composition-root";

export const loginDuplicateValid = async (req: Request, res: Response, next: NextFunction) => {
    const usersService = myContainer.resolve(UsersService)
    const duplicateLogin = await usersService.findUserByLogin(req.body.login)
    if (duplicateLogin) {
        return res.status(400).send(errorMessage("login"))
    }
    next()
}