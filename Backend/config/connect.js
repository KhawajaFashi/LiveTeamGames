import mongoose from "mongoose";

const connection = async (url) => {
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("Connected to MongoDB", url);
    }).catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });
}

export default connection;