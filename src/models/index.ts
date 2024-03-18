import mongoose from "mongoose";
import UserSchema, { IUser } from "./UserSchema";
import CampaignSchema, { ICampaign } from "./CampaignSchema";

const User =
  mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);

const Campaign =
  mongoose.models.Campaign ||
  mongoose.model<ICampaign>("Campaign", CampaignSchema);

export { User, Campaign };