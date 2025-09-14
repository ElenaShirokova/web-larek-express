import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { errors } from 'celebrate';
import productsRouter from './routes/product';
import ordersRouter from './routes/order';
import { errorHandler, notFoundHandler } from './middlewares/error-handler';
import { requestLogger, errorLogger } from './middlewares/logger';

const { PORT = 3000 } = process.env;
const { DB_ADDRESS = 'mongodb://localhost:27017' } = process.env;

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DB_ADDRESS);

app.use(requestLogger);

app.use('/order', ordersRouter);
app.use('/product', productsRouter);
app.use(express.static(path.join(__dirname, 'public')));

app.use(errorLogger);

app.use('*', notFoundHandler);
app.use(errors());
app.use(errorHandler);

// eslint-disable-next-line no-console
app.listen(PORT, () => { console.log(`App listening on port ${PORT}`); });
