import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear(); 

const stan = nats.connect('ticketing', 'asdf', {
    url: 'http://localhost:4222'
});

stan.on('connect', async () => {
    console.log('Publisher connected to NATS');

    const publisher = new TicketCreatedPublisher(stan);

    try {
        await publisher.publish({
            id: '111',
            title: 'Music Concert',
            price: 10000
        });
    } catch (error) {
        console.log(error);
    }
});