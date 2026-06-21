import mongoose from "mongoose";

export default() => {
    mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("connected to MongoDB"))
    .catch((err) => console.log("err", err.message))
};