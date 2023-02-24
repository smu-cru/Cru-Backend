import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser"
const dotenv = require("dotenv")
import passport from "passport";
import loginRoutes from "./routes/login"
import userRoutes from "./routes/user"
import groupRoutes from "./routes/group"
dotenv.config()

require("./auth/auth")

async function connect() {
    mongoose.set('strictQuery', true)
    await mongoose.connect(process.env.MONGO_URL)
}

connect()
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.set('trust proxy', true);

app.use('/', loginRoutes)
app.use('/user', passport.authenticate('jwt', { session: false }), userRoutes)
app.use('/group', passport.authenticate('jwt', { session: false }), groupRoutes)

app.get('/', (req, res) => {
    res.send("Hello World!")
})

var server = app.listen(3000, "0.0.0.0", () => {
    if (server) {
        console.log(`server started on port 3000`);
        console.log(server.address())
    }
});