import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

const createTicket = async (title: string, price: number) => {
    const ticket = Ticket.build({
        title,
        price,
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

it('deletes the order if the user is authorized', async () => {
    const ticket = await createTicket('Concert', 100);
    const userCookie = await global.signin();
    const { body: order } = await createOrder(userCookie, ticket.id);

    const response = await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', userCookie)
        .expect(204);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it('emit a order cancelld event', async () => {
    const ticket = await createTicket('Concert', 100);
    const userCookie = await global.signin();
    const { body: order } = await createOrder(userCookie, ticket.id);

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', userCookie)
        .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
