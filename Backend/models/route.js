import mongoose from "mongoose";

const { Schema } = mongoose;

// ------------------ Sub Schemas ------------------

// General Settings
const GeneralSchema = new Schema({
    backgroundMusic: { defaultStatus: Boolean, path: String },
    gameLogo: { defaultStatus: Boolean, path: String },
    welcomeBackground: { defaultStatus: Boolean, path: String },
    helpBackground: { defaultStatus: Boolean, path: String },
    itemIcon: { defaultStatus: Boolean, path: String },
    scoreIcon: { defaultStatus: Boolean, path: String },
});

// Map Settings
const MapSchema = new Schema({
    mapStyle: { defaultStatus: Boolean, path: String },
    mapQuestMarker: { defaultStatus: Boolean, path: String }, // image path
    mapTeamMarker: { defaultStatus: Boolean, path: String },  // image path
    finalLocationMarker: { defaultStatus: Boolean, path: String }, // image path
    mapLoader: { defaultStatus: Boolean, path: String }, // image path
    mapHelping: [
        {
            defaultStatus: Boolean,
            path: String
        },
    ],
});

// ------------------ Main Schema ------------------

const RouteSchema = new Schema({
    name: { type: String, required: true, unique:true },
    riddle: [{ type: Schema.Types.ObjectId, ref: "riddle" }],
    lang: { type: String, default: "EN" },
    active: { type: Boolean },
    favourite: { type: Boolean, default: false },
    playingTime: Number,
    numberOfItems: Number,
    cheatCode: String,

    adminCode: {
        type: String,
    },
    whiteLabel: {
        defaultStatus: {
            type: Boolean, default: false
        },
        path: {
            type: String, default: ""
        }
    },

    // RELATIONS
    gameName: { type: String, required: true },
    highScore: { type: Schema.Types.ObjectId, ref: "highScore" },
    // creators: [{ type: Schema.Types.ObjectId, ref: "User" }],

    // SUBSECTIONS
    general: GeneralSchema,
    map: MapSchema,

    // Videos
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
        arVideoTutorial: String,
        introVideo: String,
        outroWinVideo: String,
        outroLoseVideo: String,
    },
}, { timestamps: true });

const route = mongoose.model("route", RouteSchema);
export default route;
