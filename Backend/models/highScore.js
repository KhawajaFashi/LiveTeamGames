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

}, { timestamps: true })



const highScore = model("highScore", highScoreSchema);

export default highScore;