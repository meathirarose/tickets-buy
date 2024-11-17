import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404);  
});

it('returns the ticker if the ticket id found', async () => {
    const setCookie = await global.signin();

    expect(setCookie).toBeDefined();

    const title = 'hellowtitle';
    const price = 25;

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', setCookie as string[])
        .send({
            title, price
        })
        .expect(201);
    
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);
    
    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
});
