import CampaignProps from "@/types/CampaignProps";
import mongoose, { Document, Schema } from "mongoose";

export interface ICampaign extends Document, CampaignProps {}

const CampaignSchema: Schema = new Schema({
  creator: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true
  },
  campaignContent: { type: String, required: true },
  campaignMedia: { type: String, required: false },
  rewardPot: { type: Number, required: true },
  claimedRewards: { type: Number, default: 0 },
  twitterLink: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

export default CampaignSchema;
