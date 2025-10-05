import sqlite3 from 'sqlite3';
import express from 'express';
import fs from 'fs';

const app = express();
const port = 8080;
const pkg = JSON.parse(fs.readFileSync('package.json'))
const version = 'v' + pkg.dependencies.express.slice(1)
app.all('/', (request, response) => {
response.set('Content-Type', 'text/html');
response.send("<h1>Registration Desk!</h1>");
});
app.listen(port, () => {
console.log(`Express ${version} Listening on Port ${port}`);
}); 