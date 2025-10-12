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
        type: Date,
        required: true,
    },

    score: {
        type: Number
    },

    riddles: [
        {
            riddle: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "riddle",
            },
            riddleStatus: {
                type: String,
                enum: ["SOLVED", "UNSOLVED", "SKIPPED"],
            },
            riddleScore: {
                type: Number,
            },
        },
    ],
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