import {NextFunction, Request, Response} from "express";

type IpListType = {
    endpoint: string
    currentIp: string
    countInput: number
    timeInput: number
}

const counterInputs: Array<IpListType> = []

export const counterInputOneIpInTenSec = (endpoint: string) => (req: Request, res: Response, next: NextFunction) => {
    const input: IpListType = {
        endpoint,
        currentIp : req.ip,
        countInput: counterInputs.length + 1,
        timeInput: +(new Date())
    }
    counterInputs.push(input)
    const copyCounterInput = [...counterInputs]
    const inputOneEndpointAndOneIp = copyCounterInput.filter(i => i.endpoint === endpoint && i.currentIp === req.ip)
    const countInputTenSec = inputOneEndpointAndOneIp.filter(c => c.timeInput >= (+new Date() - 10000))
    if (countInputTenSec.length > 5) return res.sendStatus(429)
    next()
}