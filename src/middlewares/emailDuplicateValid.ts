import {NextFunction, Request, Response} from "express";
import {UsersService} from "../domain/users-service";
import {errorMessage} from "../helpers/helper";
import {myContainer} from "../composition-root";

export const emailDuplicateValid = async (req: Request, res: Response, next: NextFunction) => {
    const usersService = myContainer.resolve(UsersService)
    const duplicateEmail = await usersService.findUserByEmail(req.body.email)
    if (duplicateEmail) {
        return res.status(400).send(errorMessage("email"))
    }
    next()
}