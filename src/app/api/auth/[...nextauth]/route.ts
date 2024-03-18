import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import Twitter from "next-auth/providers/twitter";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
import { dbConnect } from "@/utils/mongodb";
import { User } from "@/models";

export const authOptions: AuthOptions = {
  providers: [
    Twitter({
      id: "twitter",
      name: "Twitter",
      clientId: process.env.TWITTER_CONSUMER_KEY!,
      clientSecret: process.env.TWITTER_CONSUMER_SECRET!,
    }),
    CredentialsProvider({
      id: "web3",
      name: "web3",
      credentials: {
        message: { label: "Message", type: "text" },
        signedMessage: { label: "Signed Message", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials?.signedMessage || !credentials?.message) {
          return null;
        }

        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message));
          const result = await siwe.verify({
            signature: credentials.signedMessage,
            nonce: await getCsrfToken({ req }),
          });

          if (!result.success) throw new Error("Invalid Signature");

          if (result.data.statement !== process.env.NEXT_PUBLIC_SIGNIN_MESSAGE)
            throw new Error("Statement Mismatch");

          // Here return everything that needs to be inside the JWT's payload
          return {
            id: siwe.address,
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },

  debug: process.env.NODE_ENV === "development",

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.sub;
      session.user.name = token.name;
      session.user.image = token.picture;
      session.user.token = token;
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        const id = account.providerAccountId;
        let user;

        switch (account.provider) {
          case "twitter":
            await dbConnect();
            // See if the user exists
            user = await User.findOne({ twitterId: id });

            const twitterProfile = profile as any;

            if (!user) {
              user = new User({
                twitterId: id,
                oauth_token: account.oauth_token,
                oauth_token_secret: account.oauth_token_secret,
                profileImage: token.picture,
                isVerified: twitterProfile.verified,
                name: twitterProfile.name,
                favourites: [],
              });

              await user.save();
            }

            break;
          case "web3":
            await dbConnect();
            // See if the user exists
            user = await User.findOne({ wallet: id });

            if (!user) {
              user = new User({
                wallet: id,
                favourites: [],
              });
              await user.save();
            }

            break;
          default:
            break;
        }

        token.sub = user._id.toString();

        if (user.name) {
          token.name = user.name;
        } else {
          token.name = user.wallet.slice(0, 6) + "..." + user.wallet.slice(-4);
        }

        token.picture = user.profileImage;
      }
      return token
    }
  },
  pages: {
    signIn:"/"
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
