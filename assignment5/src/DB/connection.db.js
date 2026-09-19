import { MongoClient } from "mongodb";

export const client = new MongoClient(process.env.MONGODB_URL);

export const connect = async () => {
  try {
    client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Something went wrong  " + error);
  }
};
export const db = client.db(process.env.DB_NAME);
