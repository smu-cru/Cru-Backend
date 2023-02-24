import express from "express";
import group from "../mongoose/group";
import user from "../mongoose/user";

const router = express.Router();

router.get('/:userID',
    async (req, res, next) => {
        console.log(req.user)
        if (req.params.userID == req.user["checkUser"].id) {
            res.send(await user.findById(req.params.userID))
        } else {
            res.send("Unauthorised")
        }
    }
)

router.get('/:userID/groups',
    async (req, res, next) => {
        console.log(req.user)
        if (req.params.userID == req.user["checkUser"].id) {
            let groups = []
            for await (const addGroup of req.user["groups"]) {
                groups.push(await group.findById(addGroup))
            }
            res.send(groups)
        } else {
            res.send("Unauthorised")
        }
    }
)

export default router;