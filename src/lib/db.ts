import mongoose from 'mongoose';

type MongooseConn = {
  db: mongoose.Connection['db'];
  client: ReturnType<mongoose.Connection['getClient']>;
};

declare global {
  var mongooseConn: {
    conn: MongooseConn | null;
    promise: Promise<MongooseConn> | null;
  };
}

const MONGODB_NAME = process.env.MONGODB_NAME!;
const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cached = global.mongooseConn;

if (!cached) {
  cached = global.mongooseConn = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    console.log('Creating new connection promise...');
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      dbName: MONGODB_NAME,
      appName: 'bookmark-manager',
      writeConcern: { w: 'majority' },
      retryWrites: true,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => ({
      db: mongoose.connection.db,
      client: mongoose.connection.getClient(),
    }));
  }

  try {
    console.log('Connecting to database...');
    cached.conn = await cached.promise;
  } catch (e) {
    console.error('Error connecting to database:', e);
    cached.promise = null;
    throw e;
  }

  console.log(`Database ${MONGODB_NAME}: connected.`);
  return cached.conn;
}

export default connectToDatabase;
