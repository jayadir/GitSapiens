import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { connect } from "./lib/db";
import User from "./models/User";
import { redirect } from "next/dist/server/api-utils";
export const options = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        await connect();
        const existingUser = await User.findOne({
          providerId: account.providerAccountId,
        });
        // console.log("user", user);
        // console.log("account", account);
        if (!existingUser) {
          await new User({
            name: user.name,
            email: user.email || null,
            providerId: account.providerAccountId,
            username: user.login,
            bio: user.bio,
            image: user.image,
          }).save();
        }
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async session({ session, token }) {
      try {
        await connect();
        const existingUser = await User.findOne({ email: session.user.email });
        if (existingUser) {
          session.user.username = existingUser.username;
          session.user._id = existingUser._id;
          session.user.image = existingUser.image;
          console.log(session.user);
        }
        return session;
      } catch (error) {
        console.log(error);
      }
    },
    async redirect({ url, baseUrl }) {
      return "/dashboard";
    }
  },
  secret:process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages:{
    signIn:'/auth/signin',
  }
};
export const { handlers, signIn, signOut, auth } = NextAuth(options);
