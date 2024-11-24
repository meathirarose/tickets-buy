import { TicketCreatedEvent } from "@arjtickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListner } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

 const setup = async () => {
    const listner = new TicketCreatedListner(natsWrapper.client);

    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'music concert',
        price: 100,
        userId: new mongoose.Types.ObjectId().toHexString(),
    }

    //create a fake msg object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listner, data, msg };
 };

 it('creates and saves a ticket', async () => {
    const { listner, data, msg } = await setup();

    await listner.onMessage(data, msg);

    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
 });

 it('acks the message', async () => {
    const { listner, data, msg } = await setup();

    await listner.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
 });