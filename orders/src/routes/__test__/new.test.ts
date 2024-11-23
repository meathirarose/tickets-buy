import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket does not exist', async () => {
    const ticketId = new mongoose.Types.ObjectId();

    const setCookie = await global.signin();
    expect(setCookie).toBeDefined();
 
    await request(app)
        .post('/api/orders')
        .set('Cookie', setCookie as string[])
        .send({ticketId})
        .expect(404);
    });

it('returns an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
        title: 'music concert',
        price: 10000
    });
    await ticket.save();

    const order = Order.build({
        userId: 'testUserId',
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket,
    });
    await order.save();

    const setCookie = await global.signin();
    expect(setCookie).toBeDefined();
 
    await request(app)
        .post('/api/orders')
        .set('Cookie', setCookie as string[])
        .send({ticketId: ticket.id})
        .expect(400);
});

it('reserves a ticket', async () => {
    const ticket = Ticket.build({
        title: 'Concert',
        price: 100,
    });
    await ticket.save();

    const setCookie = await global.signin();
    expect(setCookie).toBeDefined();

    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', setCookie as string[])
        .send({ ticketId: ticket.id })
        .expect(201); 

    expect(response.body).toHaveProperty('id');
    expect(response.body.status).toEqual(OrderStatus.Created); 
    expect(response.body.ticket.id).toEqual(ticket.id); 
});

it('emits an order created event', async () => {
    const ticket = Ticket.build({
        title: 'Concert',
        price: 100,
    });
    await ticket.save();

    const setCookie = await global.signin();
    expect(setCookie).toBeDefined();

    await request(app)
        .post('/api/orders')
        .set('Cookie', setCookie as string[])
        .send({ ticketId: ticket.id })
        .expect(201); 

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
