import express from 'express';
import cors from 'cors';
import UserRouter from './routes/UserRouter';
import ProductRouter from './routes/ProductRouter';
import CartRouter from './routes/CartRouter';

const app = express();
const PORT = 4000;

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.post('/api/login', (req, res) => {
    console.log("로그인 요청 받음:", req.body);
    // 임시 응답
    if(req.body.email) {
        res.json({ message: "로그인 성공", token: "temp-token-12345" });
    } else {
        res.status(400).json({ message: "이메일이 없습니다." });
    }
});

app.use('/api/users', UserRouter);
app.use('/api/products', ProductRouter);
app.use('/api/cart', CartRouter);

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
