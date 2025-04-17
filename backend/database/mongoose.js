require('dotenv').config({ path: '../../../.env' });
const mongoose = require('mongoose');

const DATABASE_NAME = process.env.DATABASE_NAME || 'pfeDB';
const DATABASE_HOST = process.env.MONGODB_HOST || 'localhost';
const MONGODB_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME ||'admin';
const MONGODB_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD ||'admin';
const DATABASE_PORT = process.env.DATABASE_PORT || '27017';

// Build the connection URI with authentication
const URI = `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}?authSource=admin`;
console.log("Attempting to connect to MongoDB with URI:", URI);

// Define the connection function using Mongoose
const connectToDatabase = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully using Mongoose');
    
    // Optional: Test the connection by listing the collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    const dbases = await mongoose.connection.db.admin().listDatabases();
    console.log('Available databases:', dbases.databases.map(db => db.name));

    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Execute connection if this file is run directly
if (require.main === module) {
  connectToDatabase()
    .then(() => console.log('Database connection test successful'))
    .catch(error => console.error('Connection test failed:', error));
}

module.exports = { connectToDatabase, mongoose };