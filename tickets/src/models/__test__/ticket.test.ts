import { Ticket } from "../ticket";

it('implements optimistic concurrency control', async () => {
     const ticket = Ticket.build({
        title: 'music concert',
        price: 50000,
        userId: '97245'
     });
     await ticket.save();

     const firstInstance = await Ticket.findById(ticket.id);
     const secondInstance = await Ticket.findById(ticket.id);

     firstInstance!.set({price: 30000});
     secondInstance!.set({price: 25000});

     await firstInstance!.save();
     try {
         await secondInstance!.save();
     }catch (err){
        return;
     }

     throw new Error('Should not reach this point');
});

it('increments the version numner on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'music concert',
        price: 30000,
        userId: '32145'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);
});