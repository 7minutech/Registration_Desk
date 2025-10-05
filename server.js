import express from 'express';
import sessionRouter from './routes/session.js';
import attendeeRouter from './routes/attendee.js';

const app = express();

app.use('/sessions', sessionRouter);
app.use('/attendees', attendeeRouter);


export { app }; 
