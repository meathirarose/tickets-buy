import { Listner, OrderCreatedEvent, OrderStatus, Subjects } from "@arjtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queue/expiration-queue";

export class OrderCreatedListner extends Listner <OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiredAt).getTime() - new Date().getTime();
        console.log('Waiting this many milliseconds to process the job:', delay);

        await expirationQueue.add(
        {
            orderId: data.id,
        },
        {
            delay: delay,
        }
        );

        msg.ack();
    }
}