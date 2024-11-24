import mongoose, { set } from "mongoose";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { Ticket } from "../../../models/ticket";
import { OrderCancelledEvent } from "@arjtickets/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: 'concert',
        price: 40000,
        userId: 'userid'
    });

    ticket.set({ orderId });
    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, orderId, data, ticket, msg };
}

it('updates the ticket, publishes the event, and acks message', async () => {
    const { listener, orderId, data, ticket, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    
    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});