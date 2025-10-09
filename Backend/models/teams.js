import mongoose, { Schema, model } from "mongoose";

const TeamsSchema = new Schema({
    gameName: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["WON", "LEFT", "LOST", "PLAY"],
        required: true,
    },
    timeLeft: {
        type: String,
        required: true,
    },
    Battery: {
        type: Number,
        required: true,
    },
    StartedAt: {
        type: Number,
        required: true,
    },

    riddles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Riddle",
        },
    ],
    route:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Route",
    },
    riddleStatus: {
        type: String,
        enum: ["SOLVED", "UNSOLVED", "SKIPPED"],
    },
    teamPics: [{
        type: String,
    }],
    teamVids: [{
        type: String,
    }],
    phone: {
        type: String,
    },
    playingTime: {
        type: String,
    },
    coordinates: {
        type: {
            type: String,
            enum: ["Point"], // Only allows Point type
            required: true,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
}, { timestamps: true })



const team = model("team", TeamsSchema);

export default team;