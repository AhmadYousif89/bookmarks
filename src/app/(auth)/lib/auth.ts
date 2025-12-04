import "server-only";

import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

import connectToDatabase from "@/lib/db";
import { sendEmail } from "../email/send.mail";
import { sendResetEmail } from "../email/send-reset.email";

const TEST_EXPIRES_IN = 20 * 60;
const PROD_EXPIRES_IN = 12 * 60 * 60; // 12 hours
const devOrigin = "http://localhost:3000";
const trustedOrigins = [process.env.BETTER_AUTH_URL as string, devOrigin];

const APP_BASE_URL =
  process.env.NODE_ENV === "development" ? devOrigin : process.env.BETTER_AUTH_URL;

const { db, client } = await connectToDatabase();
export const auth = betterAuth({
  appName: "Personal Finance App",
  baseURL: APP_BASE_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,
  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 1 * 60 * 60, // 1 hour
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      try {
        const u = new URL(url);
        u.searchParams.set("callbackURL", "/dashboard");
        await sendEmail(user, u.toString());
      } catch (e) {
        console.error("Error constructing verification URL:", e);
        await sendEmail(user, url);
      }
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 10 * 60, // 10 minutes
    sendResetPassword: async ({ user, url, token }) => {
      try {
        const u = new URL(url);
        u.searchParams.set("token", token);
        await sendResetEmail(user, u.toString());
      } catch (e) {
        console.error("Error constructing reset password URL:", e);
        await sendResetEmail(user, url);
      }
    },
  },
  user: {
    deleteUser: { enabled: true },
    additionalFields: {
      isDemo: { type: "boolean", defaultValue: false, required: false },
      role: { type: "string", defaultValue: "user", required: false },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60,
    },
    expiresIn: process.env.NODE_ENV === "production" ? PROD_EXPIRES_IN : TEST_EXPIRES_IN,
    freshAge: 15 * 60, // 15 minutes
    updateAge: 15 * 60, // 15 minutes
  },
  database: mongodbAdapter(db, { client, usePlural: true }),
  plugins: [nextCookies()],
});
