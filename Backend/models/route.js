import mongoose from "mongoose";

const { Schema } = mongoose;

// ------------------ Sub Schemas ------------------

// General Settings
const GeneralSchema = new Schema({
    backgroundMusic: { defaultStatus: String, path: String },
    gameLogo: { defaultStatus: String, path: String },
    welcomeBackground: { defaultStatus: String, path: String },
    helpBackground: { defaultStatus: String, path: String },
    itemIcon: { defaultStatus: String, path: String },
    scoreIcon: { defaultStatus: String, path: String },
});

// Map Settings
const MapSchema = new Schema({
    mapStyle: { defaultStatus: String, path: String },
    mapQuestMarker: { defaultStatus: String, path: String }, // image path
    mapTeamMarker: { defaultStatus: String, path: String },  // image path
    finalLocationMarker: { defaultStatus: String, path: String }, // image path
    mapLoader: { defaultStatus: String, path: String }, // image path
    mapHelping: [
        {
            defaultStatus: String,
            path: String
        },
    ],
    gearSettings: {
        startText: String,
        endText: String,
        endLocation: {
            active: Boolean,
            name: String,
            coordinates: {
                lat: Number,
                lng: Number,
            },
        },
    },
});

// ------------------ Main Schema ------------------

const RouteSchema = new Schema({
    name: { type: String, required: true },
    riddle: { type: Schema.Types.ObjectId, ref: "Riddle" },
    lang: { type: String, default: "EN" },
    active: { type: Boolean },
    favourite: { type: Boolean, default: false },
    playingTime: Number,
    numberOfItems: Number,
    cheatCode: String,

    adminCode: {
        type: String,
    },

    // RELATIONS
    gameName: { type: String, required: true },
    highScore: { type: Schema.Types.ObjectId, ref: "highScore" },
    // creators: [{ type: Schema.Types.ObjectId, ref: "User" }],

    // SUBSECTIONS
    general: GeneralSchema,
    map: MapSchema,

    // Videos
    arVideoTutorial: String,
    introVideo: String,
    outroWinVideo: String,
    outroLoseVideo: String,
}, { timestamps: true });

const route = mongoose.model("route", RouteSchema);
export default route;
