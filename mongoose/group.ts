import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    name: String,
    teleGroupID: Number
})

export default mongoose.model('Group', groupSchema)