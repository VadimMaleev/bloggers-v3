import {ObjectId} from "mongodb";


export type BloggerDBType = {
    _id: ObjectId
    name: string
    youtubeUrl: string
    createdAt: Date
}

export type BloggerType = {
    id: string
    name: string
    youtubeUrl: string
}

export type BloggerRepType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<BloggerType>
}

export type NewestLikesType = {
    addedAt: Date
    userId: string
    login: string
}

export type PostDBType = {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: Date
}

export type ExtendedLikesInfoType = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeType
    newestLikes: NewestLikesType
}

export type PostType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: Date
    extendedLikesInfo: ExtendedLikesInfoType
}

export type PostsRepType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<PostType>
}

export type UserType = {
    id: string
    login: string
    email: string
    createdAt: Date
}

export type UserDBType = {
    _id: string
    accountData: {
        userName: string
        email: string
        passwordHash: string
        createdAt: Date
    },
    emailConfirmation: {
        confirmationCode: string
        expirationDate: Date
        isConfirmed: boolean
    }
}

export type UserRepType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<UserType>
}

type LikesInfoType = {
    likesCount: number
    dislikesCount: number
    myStatus: string
}

export type CommentType = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: Date
}
export type CommentTypeLikeInfoType = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: Date
    likesInfo: LikesInfoType
}

export type CommentsRepType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<CommentType>
}

export type CommentDBType = {
    _id: ObjectId
    content: string
    userId: string
    userLogin: string
    createdAt: Date
    postId: string
}
export type BlackListRefreshTokenType = {
    _id: string
    token: string
    expirationDate: number
}
export type RefreshTokenResponseType = {
    ip: string
    title: string
    lastActiveDate: Date
    deviceId: string
}
export type LikeType = "Like" | "Dislike" | "None"

export type LikesAndDislikeCounterType = {
    likesCount: number
    dislikesCount: number
}

export type LikeTypeObj =
    {
        _id: ObjectId,
        userId: ObjectId,
        addedAt: Date,
        status: string
    }

export type LikeTypeToObject = {
    likesOrDislikes: Array<LikeTypeObj>
}

export type LikeDBType = {
    _id: ObjectId
    idObject: ObjectId
    userId: ObjectId
    login: string
    addedAt: Date
    status: LikeType
    postOrComment: string
}
export enum StatusGame {
    PendingSecondPlayer = "PendingSecondPlayer",
    Active = "Active",
    Finished = "Finished"
}
export enum AnswerStatus {
    Correct = "Correct",
    Incorrect = "Incorrect"
}
export type AnswerType = {
    questionId: ObjectId
    answerStatus: AnswerStatus
    addedAt: Date
}
export type PlayerType = {
    playerId: ObjectId
    answers: [AnswerType] | []
    score: number
}
export type QuestionType = {
    questionId: ObjectId
    questionBody: string
    answerBody: string
}
export type PairQuizGameDBType = {
    _id: ObjectId
    firstPlayer: PlayerType
    secondPlayer: PlayerType | null
    questions: [QuestionType]
    status: StatusGame
    pairCreatedDate: Date
    startGameDate: Date | null
    finishGameDate: Date | null
}
export type PlayerResponseType = {
    answers: [AnswerType] | []
    user: {
        id: string
        login: string
    }
    score: number
}
export type QuestionResponseType = Array<{
    id: string
    body: string
}>
export type PairQuizGameResponseType = {
    id: string
    firstPlayer: PlayerResponseType
    secondPlayer: PlayerResponseType | null
    questions: QuestionResponseType
    status: StatusGame
    pairCreatedDate: Date
    startGameDate: Date | null
    finishGameDate: Date | null
}
export type ReturnSecurityDeviceType = {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
}

export type RefreshTokenDBType = {
    _id: ObjectId
    issuedAt: string
    deviceId: string
    ip: string
    deviceName: string
    userId: string
    expiresAt: string
    lastActiveDate: Date
}