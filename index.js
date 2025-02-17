import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import connectToDb from './src/connections/DbController.js'
import chefsRoutes from './src/routes/chefsRoutes.js'
import orderRoutes from './src/routes/orderscheckRoutes.js'

dotenv.config({
    path:'./.env'
})
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/auth', chefsRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(PORT, () => {
    connectToDb();
    console.log(`Server is running on http://localhost:${PORT}`);
});