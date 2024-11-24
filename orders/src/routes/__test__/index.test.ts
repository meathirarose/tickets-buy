import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

const createTicket = async (title: string, price: number) => {
    const ticket = Ticket.build({
        title,
        price,
        id: new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();
    return ticket;
};

const createOrder = async (cookie: string[], ticketId: string) => {
    return await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId })
        .expect(201);
};

it('fetches orders for a particular user', async () => {
    // Step 1: Create tickets
    const ticketOne = await createTicket('Concert A', 10000);
    const ticketTwo = await createTicket('Concert B', 15000);
    const ticketThree = await createTicket('Concert C', 5000);

    // Step 2: Sign in two users
    const userOneCookie = await global.signin();
    const userTwoCookie = await global.signin();

    // Step 3: Create orders for each user
    await createOrder(userOneCookie, ticketOne.id); 
    const { body: userTwoOrder1 } = await createOrder(userTwoCookie, ticketTwo.id);
    const { body: userTwoOrder2 } = await createOrder(userTwoCookie, ticketThree.id);

    // Step 4: Fetch orders for User 2
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwoCookie)
        .expect(200);

    expect(response.body.length).toEqual(2);  
    expect(response.body[0].id).toEqual(userTwoOrder1.id);
    expect(response.body[1].id).toEqual(userTwoOrder2.id);
    expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
    expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});
