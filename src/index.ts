import 'dotenv/config'
import {runDb} from "./db";
import {app} from "./app";

const port = process.env.PORT || 5000

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`App listening port ${port}`)
    })
}

startApp()