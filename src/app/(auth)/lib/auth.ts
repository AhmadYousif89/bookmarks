import 'server-only';

import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import connectToDatabase from '@/lib/db';

const TEST_EXPIRES_IN = 2 * 60 * 60;
const PROD_EXPIRES_IN = 12 * 60 * 60; // 12 hours

const trustedOrigins = (request: Request) => {
  const origin = request.headers.get('origin');
  const localIpPattern = /^http:\/\/192\.168\.\d+\.\d+:3000$/;
  const devOrigins = ['http://localhost:3000'];

  if (origin && localIpPattern.test(origin)) devOrigins.push(origin);

  return process.env.NODE_ENV === 'development' ? devOrigins : [process.env.BETTER_AUTH_URL!];
};

const { db, client } = await connectToDatabase();
export const auth = betterAuth({
  appName: 'Personal Finance App',
  baseURL:
    process.env.NODE_ENV !== 'development' ? process.env.BETTER_AUTH_URL : 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,
  user: {
    deleteUser: { enabled: true },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60,
    },
    expiresIn: process.env.NODE_ENV === 'production' ? PROD_EXPIRES_IN : TEST_EXPIRES_IN,
    freshAge: 15 * 60, // 15 minutes
    updateAge: 15 * 60, // 15 minutes
  },
  emailAndPassword: { enabled: true },
  database: mongodbAdapter(db, { client, usePlural: true }),
  plugins: [nextCookies()],
});
