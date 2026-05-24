import mongoose from 'mongoose';

const connectDB = async () => {
  if (process.env.USE_MEMORY_DB === 'true') {
    console.log('[Database] Using in-memory development database');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/avidus_rbac');
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Listeners for database events
mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB disconnected!');
});

mongoose.connection.on('error', (err) => {
  console.error(`[Database] MongoDB connection error event: ${err.message}`);
});

export default connectDB;
