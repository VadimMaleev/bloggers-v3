import {NextFunction, Request, Response} from "express";

type InputType = {
    endpoint: string,
    ip: string,
    countInput: number,
    timeInput: number
}

    const ipObject: InputType[] = []


export const ipBlockMiddleware = (endpoint: string) => (req: Request, res: Response, next: NextFunction) => {
    const input = {
        endpoint: endpoint,
        ip: req.ip,
        countInput: ipObject.length + 1,
        timeInput: +(new Date())
    }
    ipObject.push(input)

    const ipAddresses = ipObject.filter(o=>o.ip === req.ip)
    const endpointObject = ipAddresses.filter(o => o.endpoint === endpoint)
    const countsArray = endpointObject.filter(o=>o.timeInput > (+(new Date())-10000))

    if (countsArray.length > 5) {
         return res.send(429)
    }

    next()
}
