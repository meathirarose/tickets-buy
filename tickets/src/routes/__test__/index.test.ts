import request from 'supertest';
import { app } from '../../app';

it('can fetch a list of tickets', async () => {
    const setCookie = await global.signin();
    expect(setCookie).toBeDefined();

    const title = 'hellowtitle';
    const price = 25;

    for (let i = 0; i < 3; i++) {
        await request(app)
            .post('/api/tickets')
            .set('Cookie', setCookie as string[])
            .send({ title, price });
    }

    const response = await request(app)
        .get('/api/tickets') 
        .set('Cookie', setCookie as string[])
        .expect(200);

    expect(response.body.length).toEqual(3); 
});
