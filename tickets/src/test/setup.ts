import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

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
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'arha@gmail.com'
    };
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // build session object { jwt: MY_JWT}
    const session = { jwt : token};

    // turn that session into json
    const sessionJSON = JSON.stringify(session);

    // take json and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    return [`session=${base64}`];
}
