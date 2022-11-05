import {Request, Response, NextFunction} from "express";

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const base64 = Buffer.from("admin:qwerty").toString("base64")
    const encode = `Basic ${base64}`
    if (authHeader === encode) {
        next()
    } else {
        res.send(401)
    }
}