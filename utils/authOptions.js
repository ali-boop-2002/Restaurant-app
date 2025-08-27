import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/config/database";
import User from "@/models/User";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        const { email, password } = credentials;

        try {
          await connectDB();

          const user = await User.findOne({ email });
          if (!user) throw new Error("No user found");

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) throw new Error("Invalid credentials");

          return {
            id: user._id,
            name: user.username,
            email: user.email,
          };
        } catch (error) {
          console.error("Credentials auth error:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    // Invoked on successful sign in
    async signIn({ user, account, profile }) {
      try {
        await connectDB();

        if (account.provider === "google") {
          const userExists = await User.findOne({ email: profile.email });

          if (!userExists) {
            const username = profile.name.slice(0, 20);

            await User.create({
              email: profile.email,
              username,
              image: profile.picture,
            });
          }
        }

        // Allow sign-in
        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
    },
    // Session callback function that modifies the session object
    async session({ session }) {
      try {
        // 1. Get user from the database
        await connectDB();
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
          console.error(
            "User not found in session callback:",
            session.user.email
          );
          return session;
        }

        // 2. Assign user id from the session
        session.user.id = user._id.toString();
        session.user.isAdmin = user.isAdmin || false;

        // 3. Return session
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        // Return the original session without modifications to prevent crashes
        return session;
      }
    },
  },
  // Add session configuration for better production handling
  session: {
    strategy: "jwt",
  },
  // Add secret configuration
  secret: process.env.NEXTAUTH_SECRET,
};
