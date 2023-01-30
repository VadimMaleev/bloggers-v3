import {injectable} from "inversify";
import {Request, Response} from "express";
import {extractUserIdFromHeaders} from "../../helpers/helper";
import {PairQuizGamesService} from "../../domain/pairQuizGame-service";
import {PairQuizGameDBType, PairQuizGameResponseType} from "../../repositories/types";


@injectable()
export class PairQuizGamesController {
    constructor(protected pairQuizGamesService: PairQuizGamesService) {}

    async getCurrentUnfinishedGameForUser(req: Request, res: Response) {
        const userId = await extractUserIdFromHeaders(req)
        const activePair: PairQuizGameResponseType | null = await this.pairQuizGamesService.getCurrentUnfinishedGameForUser(userId)
        if(!activePair) res.sendStatus(404)
        res.status(200). json(activePair)
    }

    async connectUserToGameOrCreateNewPair(req: Request, res: Response) {
        const userId = await extractUserIdFromHeaders(req)
        const gameWithoutSecondPlayer: PairQuizGameDBType | null = await this.pairQuizGamesService.findGameWithoutSecondPlayer(userId)
        if(gameWithoutSecondPlayer) {
            await this.pairQuizGamesService.addSecondPlayerToPair(userId!, gameWithoutSecondPlayer._id)
            return res.sendStatus(200)
        }
        await this.pairQuizGamesService.createNewPair(userId!)
        return res.sendStatus(200)
    }
}