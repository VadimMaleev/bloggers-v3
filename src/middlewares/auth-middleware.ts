import {NextFunction, Request, Response} from "express";

export const authMiddleware =  (req: Request, res: Response, next: NextFunction) => {

    const auth = {login: 'admin', password: 'qwerty'}

    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const b64authType = (req.headers.authorization || '').split(' ')[0] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

    if (login && password && login === auth.login && password === auth.password && b64authType === "Basic") {
        return next()
    }
    res.status(401).send('Authentication required.')
}