import { Schema, model } from "mongoose";

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
    routeName: {
        type: String,
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
    piture: {
        type: String,
        required: true,
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
        type: String,
        required: function () {
            return this.type === "Augmented Reality";
        },
    },

}, { timestamps: true })



const riddle = model("riddle", riddleSchema);

export default riddle;