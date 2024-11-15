import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async () => {

    const setCookie = await global.signin();

    expect(setCookie).toBeDefined();

    const response = await request(app)
        .get('/api/users/currentuser') 
        .set('Cookie', setCookie as string[]) 
        .send()
        .expect(200);

    expect(response.body.currentUser.email).toEqual('arha@gmail.com');
});

it('responds with null if not authenticated', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200);

    expect(response.body.currentUser).toEqual(null);
});