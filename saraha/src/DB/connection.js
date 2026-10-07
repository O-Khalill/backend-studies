import mongoose from "mongoose";
import { MONGO_URI } from "../config/index.js";

export function connectDB() {
  try {
    mongoose.connect(MONGO_URI);
    console.log("Connected to DB successfully");
  } catch (error) {
    console.log("Couldn't connect " + error);
  }
}
