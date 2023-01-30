import {Router} from "express";
import {myContainer} from "../composition-root";
import {PairQuizGamesController} from "./controllers/pairQuizGame-controller";
import {authTokenMiddleware} from "../middlewares/Auth-token-middleware";
import {checkActivePair} from "../middlewares/checkActivePair";

export const pairQuizGamesRouter = Router()

const pairQuizGamesController = myContainer.resolve(PairQuizGamesController)

pairQuizGamesRouter.get('/my-current', authTokenMiddleware, pairQuizGamesController.getCurrentUnfinishedGameForUser.bind(pairQuizGamesController))
pairQuizGamesRouter.post('/connection', authTokenMiddleware, checkActivePair, pairQuizGamesController.connectUserToGameOrCreateNewPair.bind(pairQuizGamesController))