import {NextFunction, Request, Response} from "express";
import {extractUserIdFromHeaders} from "../helpers/helper";
import {PairQuizGameResponseType} from "../repositories/types";
import {myContainer} from "../composition-root";
import {PairQuizGamesService} from "../domain/pairQuizGame-service";

export const checkActivePair =  async (req: Request, res: Response, next: NextFunction) => {
    const pairQuizGamesService = myContainer.resolve(PairQuizGamesService)
    const userId = await extractUserIdFromHeaders(req)
    const activePair: PairQuizGameResponseType | null = await pairQuizGamesService.getCurrentUnfinishedGameForUser(userId)
    if (activePair) res.sendStatus(403)
    next()
}