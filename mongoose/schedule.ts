import mongoose, { Schema } from "mongoose";

const scheduleSchema = new mongoose.Schema({
    schedule: String,
    group: { type: Schema.Types.ObjectId, ref: 'Group' },
})

export default mongoose.model('Schedule', scheduleSchema)