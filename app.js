import http from 'http';
import dotenv from 'dotenv';
import express from 'express';
import router from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { connectMongoDB } from './db/connectMongoDB.js';
dotenv.config();
const port = process.env.PORT;
const host = process.env.HOST;
const app = express();
connectMongoDB();
const server = http.createServer(app);
server.listen(port, host, () => {
    console.log(`Server started at http://${host}:${port}`);
});
app.use(express.json());
app.use(router);
app.use(errorHandler);
