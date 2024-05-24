import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/time_management");

export default mongoose;