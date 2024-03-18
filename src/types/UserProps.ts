export default interface UserProps {
  name?: string;
  isVerified?: boolean;
  profileImage?: string;
  wallet?: string;
  oauth_token_secret?: string;
  oauth_token?: string;
  favourites?: string[];
  twitterId?: string;
  registeredAt: Date;
}