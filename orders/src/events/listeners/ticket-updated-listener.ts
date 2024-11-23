import { Listner, Subjects, TicketUpdatedEvent } from "@arjtickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListner extends Listner <TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.id);

        if(!ticket){
            throw new Error('Ticket not found');
        }

        const { title, price } = data;
        ticket.set({ title, price });

        await ticket.save();

        msg.ack();
    }
} 