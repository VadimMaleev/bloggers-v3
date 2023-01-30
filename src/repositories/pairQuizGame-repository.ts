import {injectable} from "inversify";
import {ObjectId} from "mongodb";
import {PairQuizGameDBType} from "./types";
import {PairQuizGames, QuestionsForGames} from "./db";

@injectable()
export class PairQuizGamesRepository {

    async findActiveGameByUserId(userId: ObjectId | null): Promise<PairQuizGameDBType | null> {
        const activeGame: PairQuizGameDBType | null = await PairQuizGames.find({
            $or: [{"firstPlayer.playerId" : userId}, {"secondPlayer.playerId" : userId}],
            finishGameDate : {$ne : null}
        }).lean()
        if(!activeGame) return null
        return activeGame
    }

    async findGameById(gameId: ObjectId | null): Promise<PairQuizGameDBType | null> {
        const pairGame: PairQuizGameDBType | null = await PairQuizGames.find({_id: gameId
        }).lean()
        if(!pairGame) return null
        return pairGame
    }

    async findGameWithoutSecondPlayerAndAddSecondPlayer(userId: ObjectId | null): Promise<PairQuizGameDBType | null> {
        const pairWithoutSecondPlayer: PairQuizGameDBType | null = await PairQuizGames.findOne({secondPlayer : null})
        if(pairWithoutSecondPlayer) return pairWithoutSecondPlayer
        return null
    }
    async findRandomFiveQuestions() {
        return QuestionsForGames.aggregate([{$sample: {size: 5}}]);
    }



}