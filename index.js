import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import connectToDb from './src/database/DbController.js'
import UserRoutes from './src/routes/UserRoutes.js'

dotenv.config({
    path:'./.env'
})
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/auth', UserRoutes);

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(PORT, () => {
    connectToDb();
    console.log(`Server is running on http://localhost:${PORT}`);
});