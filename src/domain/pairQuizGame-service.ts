import {injectable} from "inversify";
import {ObjectId} from "mongodb";
import {PairQuizGamesRepository} from "../repositories/pairQuizGame-repository";
import {
    PairQuizGameDBType,
    PairQuizGameResponseType,
    PlayerResponseType,
    QuestionResponseType,
    QuestionType,
    StatusGame
} from "../repositories/types";
import {UsersService} from "./users-service";
import {PairQuizGames} from "../repositories/db";
import mongoose, {Document} from "mongoose";


@injectable()
export class PairQuizGamesService {
    constructor(protected pairQuizGamesRepository: PairQuizGamesRepository,
                protected usersService: UsersService) {
    }

    async getCurrentUnfinishedGameForUser(userId: ObjectId | null): Promise<PairQuizGameResponseType | null> {
        const activeGameByUserId = await this.pairQuizGamesRepository.findActiveGameByUserId(userId)
        if (!activeGameByUserId) return null
        const firstPlayer: PlayerResponseType = {
            answers: activeGameByUserId.firstPlayer.answers,
            user: {
                id: activeGameByUserId.firstPlayer.playerId.toString(),
                login: await this.usersService.findUserByIdAndReturnLogin(activeGameByUserId.firstPlayer.playerId)
            },
            score: activeGameByUserId.firstPlayer.score
        }
        let secondPlayer: PlayerResponseType | null = null
        if (activeGameByUserId.secondPlayer) {
            secondPlayer = {
                answers: activeGameByUserId.secondPlayer.answers,
                user: {
                    id: activeGameByUserId.secondPlayer.playerId.toString(),
                    login: await this.usersService.findUserByIdAndReturnLogin(activeGameByUserId.secondPlayer.playerId)
                },
                score: activeGameByUserId.secondPlayer.score
            }
        }
        const questions: QuestionResponseType = activeGameByUserId.questions.map((q) => {
            return {
                id: q.questionId.toString(),
                body: q.questionBody
            }
        })
        let statusGame: StatusGame = StatusGame.PendingSecondPlayer
        if (activeGameByUserId.secondPlayer) {
            statusGame = StatusGame.Active
        }
        return {
            id: activeGameByUserId._id.toString(),
            firstPlayer: firstPlayer,
            secondPlayer: secondPlayer,
            questions: questions,
            status: statusGame,
            pairCreatedDate: activeGameByUserId.pairCreatedDate,
            startGameDate: activeGameByUserId.startGameDate,
            finishGameDate: activeGameByUserId.finishGameDate
        }
    }

    async findGameWithoutSecondPlayer(userId: ObjectId | null): Promise<PairQuizGameDBType | null> {
        const gameWithoutSecondPlayer: PairQuizGameDBType | null = await this.pairQuizGamesRepository.findGameWithoutSecondPlayerAndAddSecondPlayer(userId)
        return gameWithoutSecondPlayer
    }


    async createNewPair(userId: ObjectId): Promise<PairQuizGameDBType> {
        const randomQuestions = await this.pairQuizGamesRepository.findRandomFiveQuestions() as unknown as [QuestionType]
        const newPair = new PairQuizGames()

        newPair._id = new mongoose.Types.ObjectId()
        newPair.firstPlayer.playerId = userId
        newPair.firstPlayer.answers = []
        newPair.firstPlayer.score = 0
        newPair.secondPlayer = null
        newPair.questions = randomQuestions
        newPair.status = StatusGame.PendingSecondPlayer
        newPair.pairCreatedDate = new Date()
        newPair.startGameDate = null
        newPair.finishGameDate = null

        await PairQuizGames.create(newPair)
        return newPair
    }



    async addSecondPlayerToPair(userId: ObjectId, gameId: ObjectId): Promise<PairQuizGameDBType> {
        // const gameDBType = await this.pairQuizGamesRepository.findGameById(gameId)
        const gameDBType = await PairQuizGames.findOne({_id: gameId})
        if (gameDBType) {
            gameDBType.secondPlayer = {playerId: userId, answers: [], score: 0}
            gameDBType.status = StatusGame.Active, gameDBType.startGameDate = new Date()
            await gameDBType.save()
            return gameDBType
        }
        return gameDBType!

    }
}