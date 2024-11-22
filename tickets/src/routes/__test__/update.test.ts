import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const setCookie = await global.signin();
    expect(setCookie).toBeDefined();

    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', setCookie as string[])
        .send({
            title: 'hellowticket',
            price: 25
        })
        .expect(404); 
});

it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'hellowticket',
            price: 25
        })
        .expect(401);
});

it('returns a 401 if a user does not own the ticket', async () => {
    const userOne = await global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', userOne as string[])
        .send({
            title: 'hellowticket',
            price: 25
        });

    const userTwo = await global.signin();
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', userTwo as string[]) 
        .send({
            title: 'hellowticketnew',
            price: 20
        })
        .expect(401);
});

it('return a 400 if the user provides invalid title or price', async () => {
    const setCookie = await global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', setCookie as string[])
        .send({
            title: 'hellowticket',
            price: 25
        });
        
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', setCookie as string[])
        .send({
            title: '',
            price: 25
        })
        .expect(400);
        
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', setCookie as string[])
        .send({
            title: 'hellowticket',
            price: -25
        })
        .expect(400);
});

it('updates the tickets provided valid inputs', async () => {
    const setCookie = await global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', setCookie as string[])
        .send({
            title: 'hellowticket',
            price: 25
        });
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', setCookie as string[])
        .send({
            title: 'hellowticketnew',
            price: 20
        })
        .expect(200);
    
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();
    
    expect(ticketResponse.body.title).toEqual('hellowticketnew');
    expect(ticketResponse.body.price).toEqual(20);
});

it('publishes an event', async () => {
    const setCookie = await global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', setCookie as string[])
        .send({
            title: 'hellowticket',
            price: 25
        });
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', setCookie as string[])
        .send({
            title: 'hellowticketnew',
            price: 20
        })
        .expect(200); 
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});