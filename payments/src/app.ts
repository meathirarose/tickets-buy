import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@arjtickets/common'; 


const app = express();
//traffic is procied to ingress-nginx
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'  //for testing, otherwise give true
  })
);

app.use(currentUser); 



app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };