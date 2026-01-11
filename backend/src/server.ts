import express from 'express';
import cors from 'cors';
import path from 'path';
import authRouter from './routes/auth.routes';
import ProductRouter from './routes/product.routes';
import cartRouter from './routes/cart.routes';
import orderRouter from './routes/order.routes';
import adminRouter from './routes/admin.routes';

const app = express();
const PORT = 4000;

app.use(cors({ origin: 'http://localhost:3000',
     credentials: true }));

     
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRouter);
app.use('/api/products', ProductRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/admin', adminRouter);

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
