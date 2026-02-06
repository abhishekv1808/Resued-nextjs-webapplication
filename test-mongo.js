require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('MONGODB_URI (masked):', process.env.MONGODB_URI ? 'mongodb+srv://***:***@' + process.env.MONGODB_URI.split('@')[1] : 'NOT SET');

async function testConnection() {
    try {
        console.log('\nAttempting to connect...');
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log('✅ MongoDB connected successfully!');
        console.log('Database name:', mongoose.connection.db.databaseName);

        // Test a simple query
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections found:', collections.map(c => c.name).join(', '));

        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB connection failed!');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

testConnection();
