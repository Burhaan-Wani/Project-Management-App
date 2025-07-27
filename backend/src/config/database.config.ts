import mongoose from "mongoose";
import config from "./app.config";

const connectDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_DB_URI);
    console.log("Connected to MongoDB...");
  } catch (error) {
    console.log("Error while connecting to MongoDB");
    process.exit(1);
  }
};

export default connectDatabase;
