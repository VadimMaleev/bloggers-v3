import {NextFunction, Request, Response} from "express";

let counter = 0;
export const requestСounter = (req: Request, res: Response, next: NextFunction) => {
    counter++;
    res.header("Counter", [counter.toString()])
    next();
}
