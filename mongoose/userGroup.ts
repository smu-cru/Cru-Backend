import mongoose, { Schema } from "mongoose";

const userGroupSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    group: { type: Schema.Types.ObjectId, ref: 'Group' },
})

export default mongoose.model('userGroup', userGroupSchema)