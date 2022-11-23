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
        public createdAt: Date
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

