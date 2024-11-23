import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('fetches the order if the user is authorized', async () => {
    const ticket = Ticket.build({ 
        title: 'Concert', 
        price: 200 
    });
    await ticket.save();

    const userCookie = await global.signin();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', userCookie)
        .send({ ticketId: ticket.id})
        .expect(201);

    const response = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', userCookie)
        .send()
        .expect(200);

    expect(response.body.id).toEqual(order.id);
    expect(response.body.ticket.id).toEqual(ticket.id);
});

it('returns a 401 if the user is not authorized to access the order', async () => {
    // Create a ticket and order with User 1
    const ticket = Ticket.build({ 
        title: 'Concert', 
        price: 200 
    });
    await ticket.save();

    const userCookie = await global.signin();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', userCookie)
        .send({ ticketId: ticket.id})
        .expect(201);

    // Attempt to access the order with User 2
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', await global.signin()) 
        .send()
        .expect(401);
});
