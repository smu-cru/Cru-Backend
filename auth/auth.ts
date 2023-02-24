import passport from "passport"
import * as localStrategy from "passport-local"
// import Strategy from "passport-local"
// const localStrategy = Strategy.Strategy
import * as jwtStrategy from "passport-jwt"
import * as bcrypt from "bcrypt"
import user from "../mongoose/user"
import userGroup from "../mongoose/userGroup"
// import { Strategy } from "passport-local"
// import "dotenv"

// do

passport.use(
    'login',
    new localStrategy.Strategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email: string, password: string, done: any) => {
            try {
                const userVerify = await user.findOne({ email })
                if (!userVerify) {
                    return done(null, false, { message: "User not found" })
                };
                const validate = await bcrypt.compare(password, userVerify.password)
                if (!validate) {
                    return done(null, false, { message: "Wrong password" })
                };
                return done(null, userVerify, { message: "Logged in successfully" });
            } catch (error) {
                console.log(error);
                return done(error)
            }
        }
    )
)

passport.use(
    new jwtStrategy.Strategy(
        {
            secretOrKey: process.env.TOKEN_SECRET as string,
            jwtFromRequest: jwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        async (token: any, done: any) => {
            console.log("TokenID: ", token)
            const checkUser = await user.findById(token.user.id)
            try {
                if (!checkUser) { done(null, false) }
                const userGroups = await userGroup.find({ "user": checkUser.id })
                let groups = []
                for (let i = 0; i < userGroups.length; i++) {
                    groups.push(userGroups[i].group.toString())
                }
                done(null, { checkUser, groups })
            } catch (error) { done(error) }
        }
    )
)