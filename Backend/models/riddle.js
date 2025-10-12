import { Schema, model } from "mongoose";
import { RIDDLE_DEFAULTS } from '../config/riddleDefaults.js';

const riddleSchema = new Schema({
    gameName: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    episode: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ["Augmented Reality", "Action Pack", "Multiple Choice", "Mini Game", "Location Based Riddle"],
        required: true,
    },
    category: {
        type: String,
        enum: ['Standard', 'Indoor', 'Bachelor Game', 'Bachelorette Game', 'Bachelor Game No Action Pack', 'Bachelorette Game No Action Pack', 'Cristmas Adventures', 'Cristmas Adventures No Action Pack'],
        required: true,
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


    radius: {
        type: Number,
        required: true,
    },
    picture: {
        type: String
    },

    description: String,

    solutions: [String],
    hint: String,

    maxScore: Number,
    tries: Number,
    deductionPercent: Number,
    allowedAttempts: Number,
    allowedTime: Number,
    metaData: String,
    helpImage: String,
    conditionalExitPoint: Boolean,
    accessConditionType: String,
    accessConditionAmount: String,

    arImageTarget: {
        type: String
    },

}, { timestamps: true })

// Pre-save hook to set default values based on type and category
riddleSchema.pre("save", function (next) {
    const type = this.type;
    const category = this.category;

    if (RIDDLE_DEFAULTS[type] && RIDDLE_DEFAULTS[type][category]) {
        const defaults = RIDDLE_DEFAULTS[type][category];

        // Apply only if not explicitly set
        if (!this.radius) this.radius = defaults.radius;
        if (!this.allowedTime) this.allowedTime = defaults.allowedTime;
        if (!this.deductionPercent) this.deductionPercent = defaults.deductionPercent;
    }

    // General sensible defaults
    if (!this.maxScore) this.maxScore = 100;
    if (!this.tries) this.tries = 3;
    if (!this.allowedAttempts) this.allowedAttempts = 3;

    next();
});
const riddle = model("riddle", riddleSchema);

export default riddle;