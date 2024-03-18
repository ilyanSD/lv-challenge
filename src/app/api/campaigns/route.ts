// Route to get all campaigns from the database

import { NextApiRequest } from "next";
import { dbConnect } from "@/utils/mongodb";
import { Campaign } from "@/models";

export async function GET(req: NextApiRequest) {
  await dbConnect();

  try {
    const campaigns = await Campaign.find({}).populate("creator");

    const result = [];

    for (const campaign of campaigns) {
      result.push({
        id: campaign._id,
        campaignContent: campaign.campaignContent,
        campaignMedia: campaign.campaignMedia,
        rewardPot: campaign.rewardPot,
        claimedRewards: campaign.claimedRewards,
        creator: {
          name: campaign.creator.name,
          profileImage: campaign.creator.profileImage,
        },
      });
    }

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error: any) {
    return new Response(error.toString(), { status: 500 });
  }
}