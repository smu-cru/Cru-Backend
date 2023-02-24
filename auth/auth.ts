import passport from "passport"
import * as localStrategy from "passport-local"
import * as jwtStrategy from "passport-jwt"
import * as GoogleStrategy from "passport-google-oauth"
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

passport.use(
    new GoogleStrategy.OAuth2Strategy(
        {
            callbackURL: "/google/callback",
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
        async (accessToken: any, refreshToken: any, profile: any, done: any) => {
            // console.log("user profile is: ", profile);
            const googleID = profile.id;
            const name = profile.displayName;
            const existingUser = await user.find({ "googleID": googleID })
            console.log("USER: ", existingUser)
            if (existingUser.length = 0) {
                console.log("This is existing")
                return done(existingUser)
            } else {
                console.log("This is create")
                const newUser = await user.create({
                    email: profile.emails[0].value,
                    googleID: googleID,
                    name: name
                });
                return done(newUser)

            }
        }
    )
);
