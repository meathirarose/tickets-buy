import nats from 'node-nats-streaming';

console.clear();

const stan = nats.connect('ticketing', 'asdf', {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Publisher connected to NATS');

    const data = JSON.stringify({
        id: '124',
        title: 'concert',
        price: 10
    });

    stan.publish('ticket:created', data, () => {
        console.log('Event published');
    });
});