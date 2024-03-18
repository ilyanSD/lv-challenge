import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) throw new Error("MONGODB_URL is not defined.");

declare global {
  var db: { conn: typeof mongoose | null };
}

let cached = global.db;

if (!cached) {
  cached = global.db = { conn: null };
}

export const dbConnect = async () => {
  if (cached.conn) return cached.conn;

  cached.conn = await mongoose.connect(MONGODB_URL);

  return cached.conn;
};