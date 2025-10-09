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
    salt: {
        type: String,
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
            folderName: { type: String, required: true },
            images: [
                {
                    name: { type: String, required: true },
                    path: { type: String, required: true },
                },
            ],
        },
    ],

}, { timestamps: true });


userSchema.pre("save", function (next) {
    const user = this;
    if (!user.isModified("password"))
        return;

    const salt = crypto.randomBytes(16).toString("hex");

    const hashedPassword = crypto.createHmac("sha256", salt).update(user.password).digest("hex");
    user.password = hashedPassword;
    user.salt = salt;

    next();
});

userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found!");
    const salt = user.salt;
    const hashedPassword = user.password;

    const userhashedPassword = crypto.createHmac("sha256", salt).update(password).digest("hex");

    if (userhashedPassword !== hashedPassword) throw new Error("Invalid password!");
    const token = generateToken(user);
    return token;
})

const User = model("User", userSchema);

export default User;