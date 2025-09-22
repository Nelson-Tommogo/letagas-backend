import { connect, connection } from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    process.exit(1);
  }
};

connection.on('disconnected', () => {
  console.log('❌ MongoDB disconnected');
});

connection.on('connected', () => {
  console.log('✅ MongoDB connected');
});

export default connectDB;