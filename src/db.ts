import * as mongoose from "mongoose";


const mongooseUri = process.env.mongooseUri


export async function runDb() {
    try {
        await mongoose.connect(mongooseUri!)
        console.log(`Mongoose connection successfully`)
    } catch (e) {
        console.log("No connection, error: ", e)
    }
}

// export async function runDb() {
//     try {
//         mongoose.connect(
//             mongooseUri,
//             () => console.log(" Mongoose is connected")
//         );
//
//     } catch (e) {
//         console.log("could not connect");
//     }
// }