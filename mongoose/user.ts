import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    googleID: String
})

userSchema.pre(
    'save',
    async function (next) {
        const user = this;
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    }
)

userSchema.methods.isValidPassword = async function (password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password)
    return compare;
}

export default mongoose.model('User', userSchema)