import mongoose, { Schema, model } from "mongoose";

const highScoreSchema = new Schema({
    gameName: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    saved: {
        type: Boolean,
        required: true,
    },
    teams: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
        },
    ],

}, { timestamps: true })



const highScore = model("highScore", highScoreSchema);

export default highScore;