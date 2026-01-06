import express from 'express';
import cors from 'cors';
import UserRouter from './routes/UserRouter';
import ProductRouter from './routes/ProductRouter';
import CartRouter from './routes/CartRouter';

const app = express();
const PORT = 4000;

app.use(cors({ origin: 'https://shopingmall-lovat.vercel.app', credentials: true }));
app.use(express.json());

app.use('/api/users', UserRouter);
app.use('/api/products', ProductRouter);
app.use('/api/cart', CartRouter);

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
