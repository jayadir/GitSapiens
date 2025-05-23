import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { connect } from "./lib/db";
import User from "./models/User";
import axios from "axios";
import { fetchUserSkills } from "./lib/github";
import { redirect } from "next/dist/server/api-utils";
export const options = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        await connect();
        const existingUser = await User.findOne({
          providerId: account.providerAccountId,
        });
        // console.log("account", account);
        // user.githubUrl = user.html_url;
        // console.log("user", user);
        const userUrl=await axios.get(`https://api.github.com/user/${account.providerAccountId}`);
        const userSkills = await fetchUserSkills(userUrl.data.url);
        if (!existingUser) {
          await new User({
            name: user.name,
            email: user.email || null,
            providerId: account.providerAccountId,
            username: user.login,
            bio: user.bio,
            image: user.image,
            skills: userSkills,
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
