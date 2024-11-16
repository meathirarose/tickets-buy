import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app'; 
import request from 'supertest';

declare global {
    var signin: () => Promise<string[]>;
}

let mongo: any;

beforeAll(async () => {

    process.env.JWT_KEY = "abcdef"
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
  
    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db!.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
});
  
afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
});

global.signin = async () => {
    const email = 'arha@gmail.com';
    const password = 'arha';

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email, password
        })
        .expect(201);

    const setCookie = response.get('Set-Cookie');

    return setCookie as string[];
}