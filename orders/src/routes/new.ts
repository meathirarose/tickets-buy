import { NotFoundError, requireAuth, validateRequest } from '@arjtickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post('/api/orders', requireAuth, 
    [
        body('ticketId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('TicketId must be provided')
    ], 
    validateRequest , async (req: Request, res: Response) => {
        const { ticketId } = req.body;

        //find the ticket the user is trying to order in the db
        const ticket = await Ticket.findById(ticketId);
        if(!ticket) {
            throw new NotFoundError(); 
        }

        //make sure that this ticket is not already reserved

        //calculate an expiration date for this order

        //build the order and save it to the db
 
        //publish an event saying that an order was created

        res.send({});
});

export { router as newOrderRouter };