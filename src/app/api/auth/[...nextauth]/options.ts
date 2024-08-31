import bcryptjs from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import GithubProvider, { GithubProfile } from "next-auth/providers/github";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/Database/dbConnect";
import Users from "@/Models/UserModel";
export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const email = credentials?.email;
          const password = credentials?.password;

          const user = await Users.findOne({ email });
          if (!user) {
            throw new Error("No user found with this email");
          }
          const checkPassword = await bcryptjs.compare(password, user.password);
          // console.log(checkPassword);
          if (!checkPassword) {
            throw new Error("Incorrect password");
          }
          return user;
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
    GoogleProvider({
      profile(profile: GoogleProfile) {
        console.log("from line 40", profile);
        return {
          ...profile,
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          role: profile.role || "Tourist",
        };
      },
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    GithubProvider({
      profile(profile: GithubProfile) {
        console.log("from line 54", profile);
        return {
          ...profile,
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
          role: profile.role || "Tourist",
        };
      },
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      await dbConnect();
      console.log("from line 53", user);
      console.log("provider name", account?.provider);
      const userExist = await Users.findOne({ email: user?.email });
      console.log(userExist);
      if (!userExist) {
        const newUser = new Users({
          name: user?.name,
          email: user?.email,
        });
        await newUser.save();
      }
      return true;
    },
    async jwt({ user, token }) {
      console.log("from line 67 user", user);
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      console.log("from line 72", token);
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      console.log("from line 81", session);
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
