import mongoose from 'mongoose';
import {
    BlackListRefreshTokenSchema,
    BloggerSchema,
    CommentSchema, LikesSchema, PairQuizGamesSchema,
    PostSchema, QuestionsSchema, RefreshTokenSchema,
    UserSchema
} from "../schema-mongoose/schema-mongoose";
//
// const uri = "mongodb://shvs1510:SMUUbQ45@ac-mpv6ar9-shard-00-00.2ytrikv.mongodb.net:27017,ac-mpv6ar9-shard-00-01.2ytrikv.mongodb.net:27017,ac-mpv6ar9-shard-00-02.2ytrikv.mongodb.net:27017/?ssl=true&replicaSet=atlas-4glm84-shard-0&authSource=admin&retryWrites=true&w=majority"
const uriMongoose = "mongodb+srv://shvs1510:SMUUbQ45@cluster0.2ytrikv.mongodb.net/instagram?retryWrites=true&w=majority"
const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017/instagram";

export const Blogs = mongoose.model('blogs', BloggerSchema)
export const Posts = mongoose.model('posts', PostSchema)
export const UserModel = mongoose.model('users', UserSchema)
export const CommentModel = mongoose.model('comments', CommentSchema)
export const BlackListRefreshTokenModel = mongoose.model('blackListRefreshToken', BlackListRefreshTokenSchema)
export const Likes = mongoose.model('likes', LikesSchema)
export const PairQuizGames = mongoose.model('pairQuizGames', PairQuizGamesSchema)
export const QuestionsForGames = mongoose.model('questionsForGames', QuestionsSchema)
export const RefreshToken = mongoose.model('refreshTokens', RefreshTokenSchema)


export async function runDb() {
    try {
        mongoose.connect(
            uriMongoose,
            () => console.log(" Mongoose is connected")
        );

    } catch (e) {
        console.log("could not connect");
    }
}


