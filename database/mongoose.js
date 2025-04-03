import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
const mongoose = require('mongoose');
const DATABASE_NAME = process.env.DATABASE_NAME ;
const DATABASE_HOST = process.env.DATABASE_HOST ;
const MONGODB_URL = process.env.MONGODB_URL ;
const MONGODB_USERNAME = process.env.MONGODB_USERNAME ;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD ;
const DATABASE_PORT = process.env.DATABASE_PORT ;

const URI = `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;
const client = new MongoClient(URI);
console.log("hmkjkljljkiii")
const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); 
  }
};
connectToDatabase().then(()=> console.log('server started')).catch(error=>(console.error('smth not good')))





// // Determine MongoDB connection URL based on environment
// const getMongoUrl = () => {
//   if (process.env.MONGODB_URL) {
//     return process.env.MONGODB_URL;
//   }
//   // Check if running in Docker environment
//   if (process.env.DOCKER_CONTAINER) {
//     return 'mongodb://mongodb:27017/proxymDB';
//   }
//   // Default for local development
//   return 'mongodb://localhost:27017/proxymDB';
// };

// const connectToDatabase = async () => {
//   try {
//     await mongoose.connect(getMongoUrl(), {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('Connected to MongoDB successfully');
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     process.exit(1); // Exit with failure
//   }
// };

// module.exports = { connectToDatabase };
