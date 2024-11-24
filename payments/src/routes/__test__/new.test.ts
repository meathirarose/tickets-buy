
import request from 'supertest'
import { app } from '../../app';
import mongoose from 'mongoose';
import { OrderStatus } from '@arjtickets/common';
import { Order } from '../../model/order';

it('returns a 404 when purchasing an order that does not exist', async () => {
    const cookie = await global.signin();

    await request(app)
      .post('/api/payments')
      .set('Cookie', cookie as string[])
      .send({
        token: 'asldkfj',
        orderId: new mongoose.Types.ObjectId().toHexString(),
      })
      .expect(404);
  });
  
  it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      price: 20,
      status: OrderStatus.Created,
    });
    await order.save();

    const cookie = await global.signin();
  
    await request(app)
      .post('/api/payments')
      .set('Cookie', cookie as string[])
      .send({
        token: 'asldkfj',
        orderId: order.id,
      })
      .expect(401);
  });
  
it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId,
      version: 0,
      price: 20,
      status: OrderStatus.Cancelled,
    });
    await order.save();

    const cookie = await global.signin(userId);
  
    await request(app)
      .post('/api/payments')
      .set('Cookie', cookie as string[])
      .send({
        orderId: order.id,
        token: 'asdlkfj',
      })
      .expect(400);
  });
  
