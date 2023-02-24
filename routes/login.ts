import passport from "passport";
import express from "express";
import jwt from "jsonwebtoken";
import user from "../mongoose/user";

const router = express.Router();

router.post(
    '/register',
    async (req, res, next) => {
        const password = req.body.password as string;
        const email = req.body.email as string;
        const name = req.body.name as string;
        const googleID = req.body.gID as string;
        const newUser = await user.create({ email, password, name, googleID })
        res.json({
            message: 'Successful registration',
            user: newUser
        })
    }
)


router.post(
    "/login",
    async (req, res, next) => {
        passport.authenticate('login', async (err, user, info) => {
            try {
                if (err || !user) {
                    const error = new Error("An error occurred");
                    console.log(info);
                    return next(error);
                }
                req.login(
                    user,
                    { session: false },
                    async (error) => {
                        if (error) return next(error);
                        const body = { "id": user.id, "email": user.email }
                        const token = jwt.sign({ user: body }, process.env.TOKEN_SECRET as string);
                        return res.json({ token, "userID": user.id })
                    }
                )
            } catch (error) {
                console.log(error);
                return next(error);
            }
        }
        )(req, res, next)
    }
)

export default router