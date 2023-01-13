import {ObjectId} from "mongodb";

export class BlogClass {
    constructor(
        public id: ObjectId,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: Date
    ) {
    }
}

export class PostClass {
    constructor(
        public id: ObjectId,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: ObjectId,
        public blogName: string,
        public createdAt: Date
) {
    }
}

export class UserClass {
    constructor(
        public id: ObjectId,
        public login: string,
        public email: string,
        public passwordHash: string,
        public createdAt: Date,
        public confirmationCode: string,
        public codeExpirationDate: Date,
        public isConfirmed: boolean
    ) {
    }
}

export type BlogsPagType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogClass[]
}

export type PostsPagType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostClass[]
}

export type UserForResponse = {
    id: ObjectId,
    login: string,
    email: string,
    createdAt: Date
}

export type UsersPagType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: UserForResponse[]
}

export class LikesInfoClass {
    constructor(
       public  likesCount: number,
       public  dislikesCount: number,
       public  myStatus: string
    ) {
    }
}

export class CommentClass {
    constructor(
        public id: ObjectId,
        public content: string,
        public userId: ObjectId,
        public userLogin: string,
        public createdAt: Date,
        public postId: ObjectId,
        public likesInfo: LikesInfoClass
    ) {     }
}

export type CommentForResponse = {
    id: ObjectId,
    content: string,
    userId: ObjectId,
    userLogin: string,
    createdAt: Date,
    likesInfo: LikesInfoClass
}

export type CommentsPagType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: CommentForResponse[]
}

export type TokenType= {
    _id: ObjectId,
    refreshToken: string
}

export class DeviceClass {
    constructor(
        public ip: string,
        public title: string,
        public lastActiveDate: string,
        public deviceId: string,
        public userId: ObjectId
    ) {
    }
}

export class RecoveryCodeClass {
    constructor(
        public code: string,
        public codeExpirationDate: Date,
        public userId: ObjectId
    ) {
    }
}

export class LikeForRepoClass {
    constructor(
        public id: ObjectId,
        public entity: string,
        public idOfEntity: ObjectId,
        public userId: ObjectId,
        public login: string,
        public addedAt: Date,
        public status: "Like" | "Dislike" | "None"
    ) {
    }
}


