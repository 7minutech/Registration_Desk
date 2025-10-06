import express from 'express';
import cors from 'cors';
import sessionRouter from './routes/session.js';
import attendeeRouter from './routes/attendee.js';
import registrationRouter from './routes/registration.js';

const app = express();
app.use(cors());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json());
app.set('view engine', 'ejs');

app.use('/sessions', sessionRouter);
app.use('/attendees', attendeeRouter);
app.use('/attendees', registrationRouter)


export { app }; 
