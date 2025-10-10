import mongoose, { Schema, model } from "mongoose";

const templateSchema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    gameName: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: Boolean,
        required: true,
    },
    riddles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "riddle",
        },
    ],

}, { timestamps: true })



const routeTemplate = model("routeTemplate", templateSchema);

export default routeTemplate;