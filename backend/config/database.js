const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Replace <db_password> with your actual password
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://ahmedcertsoft:<db_password>@cluster0.dl1uavy.mongodb.net/servicepro?retryWrites=true&w=majority&appName=Cluster0';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
