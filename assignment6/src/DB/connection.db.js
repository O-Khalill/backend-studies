import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connection to DB succeeded");
  } catch (error) {
    console.log("Connection to db failed " + error);
  }
}
