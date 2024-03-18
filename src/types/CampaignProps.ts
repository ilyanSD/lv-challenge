import UserProps from "./UserProps";

export default interface CampaignProps {
  creator: UserProps;
  campaignContent: string;
  campaignMedia: string;
  rewardPot: number;
  claimedRewards: number;
  twitterLink?: string;
  createdAt: Date;
}

export interface CampaignPropsWithId extends CampaignProps {
  id: string;
}