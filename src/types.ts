import {ObjectId} from "mongodb";

export class BlogClass {
    constructor(
        public id: ObjectId,
        public name: string,
        public youtubeUrl: string,
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

// export type PostForResponse = {
//     title: string,
//     shortDescription: string,
//     content: string,
//     blogId: ObjectId
//     blogName: string
// }


