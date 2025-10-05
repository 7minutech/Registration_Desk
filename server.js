import express from 'express';
import sessionRouter from './routes/session.js';

const app = express();

app.use('/sessions', sessionRouter);

export { app }; 
