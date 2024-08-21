import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';
dotenv.config({ path: './src/tests/.env.test' });

let mongoServer: MongoMemoryServer;
//we want to make the tests on seprarate database
beforeAll(async () => {

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri; 
    await mongoose.connect(uri);
});

afterAll(async () => {
    if (mongoose.connection.db) {
        await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
    await mongoServer.stop();
});