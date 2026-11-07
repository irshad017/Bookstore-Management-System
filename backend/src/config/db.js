const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/bookstore';

  try {
    // Attempt standard connection first with a 3-second timeout
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`[MongoDB] Could not connect to configured URI (${mongoUri}): ${err.message}`);

    // If in development/test environment, start MongoMemoryServer fallback
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('[MongoDB] Starting in-memory MongoDB instance for development/testing...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        const conn = await mongoose.connect(uri);
        console.log(`[MongoDB] Connected to in-memory instance at ${uri}`);
        return conn;
      } catch (memErr) {
        console.error(`[MongoDB] Failed to start in-memory instance: ${memErr.message}`);
        process.exit(1);
      }
    } else {
      console.error('[MongoDB] Production database connection failed. Exiting...');
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.error(`[MongoDB] Error disconnecting: ${err.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
