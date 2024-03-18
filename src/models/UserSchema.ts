import UserProps from "@/types/UserProps";
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document, UserProps {}

const UserSchema: Schema = new Schema({
  name: { type: String, required: false },
  isVerified: { type: Boolean, required: false },
  profileImage: { type: String, default: "https://abs.twimg.com/sticky/default_profile_images/default_profile.png" },
  wallet: { type: String, required: false, unique: true },
  favourites: [{ type: Schema.Types.ObjectId, ref: "Campaign"}],
  oauth_token_secret: { type: String, required: false },
  oauth_token: { type: String, required: false },
  twitterId: { type: String, required: false, unique: true },
  registeredAt: { type: Date, default: Date.now },
});

export default UserSchema;
