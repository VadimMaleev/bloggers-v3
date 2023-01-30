import {validationResult} from "express-validator";
import express, {NextFunction} from "express";



export const checkErrorsValidation =  async (req: express.Request, res: express.Response, next: NextFunction) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errs = errors.array({onlyFirstError: true}).map((error) => {
            const errorObject = {
                message: error.msg,
                field: error.param
            }
            return errorObject
        })

        return res.status(400).send(
            {
                errorsMessages: errs
            });

    }
    next()
}
