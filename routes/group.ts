import express from "express";
import user from "../mongoose/user";
import schedule from "../mongoose/schedule";
import userGroup from "../mongoose/userGroup";
import group from "../mongoose/group";

const router = express.Router();

router.get('/:groupID',
    async (req, res, next) => {
        console.log(req.user)
        const reqGroups = req.user["groups"] as string[]
        if (reqGroups.includes(req.params.groupID)) {
            res.send(await group.findById(req.params.groupID))
        }
        else {
            res.send("Unauthorised")
        }
    }
)

router.get('/:groupID/schedules',
    async (req, res, next) => {
        console.log(req.user)
        const reqGroups = req.user["groups"] as string[]
        if (reqGroups.includes(req.params.groupID)) {
            const schedules = await schedule.find({ "group": reqGroups })
            res.send(schedules)
        }
        else {
            res.send("Unauthorised")
        }
    }
)

router.get('/:groupID/users',
    async (req, res, next) => {
        console.log(req.user)
        const reqGroups = req.user["groups"] as string[]
        if (reqGroups.includes(req.params.groupID)) {
            const userGroups = await userGroup.find({ "group": reqGroups })
            const users = []
            for await (const userGroup of userGroups) {
                users.push(await user.findById(userGroup.user))
            }
            res.send(users)
        }
        else {
            res.send("Unauthorised")
        }
    }
)

export default router;
