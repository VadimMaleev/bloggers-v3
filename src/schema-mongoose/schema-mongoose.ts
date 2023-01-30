import mongoose from "mongoose";
import {
    AnswerType,
    BlackListRefreshTokenType,
    BloggerDBType,
    CommentDBType,
    LikeDBType, LikesAndDislikeCounterType, LikeTypeObj, LikeTypeToObject, PairQuizGameDBType, PlayerType,
    PostDBType, QuestionType, RefreshTokenDBType,
    UserDBType
} from "../repositories/types";
import {ObjectId} from "mongodb";

export const BloggerSchema = new mongoose.Schema<BloggerDBType>({
    _id: ObjectId,
    name: String,
    youtubeUrl: String,
    createdAt: Date
}, {
    versionKey: false
});
export const PostSchema = new mongoose.Schema<PostDBType>({
    _id: ObjectId,
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: Date
}, {
    versionKey: false
});
export const UserSchema = new mongoose.Schema<UserDBType>({
    _id: ObjectId,
    accountData: {
        userName: String,
        email: String,
        passwordHash: String,
        createdAt: Date
    },
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: Date,
        isConfirmed: Boolean
    }
}, {
    versionKey: false
});
export const LikesOrDislikesSchema = new mongoose.Schema<LikeTypeObj>(
    {
        _id: ObjectId,
        addedAt: Date,
        userId: ObjectId,
        status: String
}, {
    versionKey: false
});
export const CommentSchema = new mongoose.Schema<CommentDBType & LikesAndDislikeCounterType & LikeTypeToObject>({
    _id: ObjectId,
    content: String,
    userId: String,
    userLogin: String,
    createdAt: Date,
    postId: String,
    likesCount: Number,
    dislikesCount: Number,
    likesOrDislikes: [LikesOrDislikesSchema]
}, {
    versionKey: false
});
export const BlackListRefreshTokenSchema = new mongoose.Schema<BlackListRefreshTokenType>({
    _id: ObjectId,
    token: String,
    expirationDate: Number
}, {
    versionKey: false
});
export const RefreshTokenSchema = new mongoose.Schema<RefreshTokenDBType>({
    issuedAt: String,
    deviceId: String,
    ip: String,
    deviceName: String,
    userId: String,
    expiresAt: String,
    lastActiveDate: Date
}, {
    versionKey: false
});
export const LikesSchema = new mongoose.Schema<LikeDBType>({
    _id: ObjectId,
    idObject: ObjectId,
    addedAt: Date,
    userId: ObjectId,
    login: String,
    status: String,
    postOrComment: String
}, {
    versionKey: false
});
export const QuestionsSchema = new mongoose.Schema<QuestionType>(
    {
        questionId: ObjectId,
        questionBody: String,
        answerBody: String
    }
);
const AnswersSchema = new mongoose.Schema<AnswerType>(
    {
        questionId: ObjectId,
        answerStatus: String,
        addedAt: Date
    }
);
const PlayerSchema = new mongoose.Schema<PlayerType>({
    playerId: ObjectId,
    answers: [AnswersSchema],
    score: Number
});
export const PairQuizGamesSchema = new mongoose.Schema<PairQuizGameDBType>({
    // _id: {type: ObjectId, required: true},
    firstPlayer: {type: PlayerSchema, required: true},
    secondPlayer: PlayerSchema,
    questions: {type: [QuestionsSchema], required: true},
    status: String,
    pairCreatedDate: {type: Date, required: true},
    startGameDate: Date,
    finishGameDate: Date
}, {
    versionKey: false
});


