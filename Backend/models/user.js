import { Schema, model } from "mongoose";
import crypto from "crypto";
import { generateToken } from "../service/auth.js";

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
    companyName: {
        type: String,
    },
    adminCode: {
        type: String,
    },
    storageUsed: {
        size: {
            type: Number,
            default: 0,
        },
        sizeUnit: {
            type: String,
            default: "MB",
        }
    },
    credits: {
        type: Number,
        default: 50,
    },
    privacyPolicy: {
        type: String,
    },
    addCompanyLogo: {
        type: Boolean,
    },
    addGameLogo: {
        type: Boolean,
    },
    addPlayingTime: {
        type: Boolean,
    },
    addScore: {
        type: Boolean,
    },
    addTeamName: {
        type: Boolean,
    },
    addOverlayFrame: {
        type: Boolean,
    },
    media: [
        {
            folderName: { type: String },
            images: [
                {
                    name: { type: String },
                    path: { type: String },
                    size: { type: Number },
                    modifiedTime: { type: Date },
                },
            ],
        },
    ],

}, { timestamps: true });


// userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
//     const user = await this.findOne({ email });
//     if (!user) throw new Error("User not found!");
//     console.log(password);
//     const salt = user.salt;
//     const hashedPassword = user.password;

//     const userhashedPassword = crypto.createHmac("sha256", salt).update(password).digest("hex");

//     if (userhashedPassword !== hashedPassword) return null;
//     const token = generateToken(user);
//     return token;
// })

const User = model("User", userSchema);

export default User;