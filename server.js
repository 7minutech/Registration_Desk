import express from 'express';
import sessionRouter from './routes/session.js';
import attendeeRouter from './routes/attendee.js';
import registrationRouter from './routes/registration.js';

const app = express();
app.use(express.json());

app.use('/sessions', sessionRouter);
app.use('/attendees', attendeeRouter);
app.use('/registrations', registrationRouter)


export { app }; 
