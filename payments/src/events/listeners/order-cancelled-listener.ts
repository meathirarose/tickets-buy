import { Listner, OrderCancelledEvent, OrderStatus, Subjects } from "@arjtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/order";

export class OrderCancelledListener extends Listner<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: { id: string; version: number; ticket: { id: string; }; }, msg: Message) {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        });

        if(!order){
            throw new Error("Order not found");
        }

        order.set({status: OrderStatus.Cancelled});
        await order.save();

        msg.ack();
    }
}