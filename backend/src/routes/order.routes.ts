import { Router } from 'express';
import { verifyToken } from '../common/middlewares';
import { completeOrder, getMyOrders } from '../controllers/order.controller';

const router = Router();

router.use(verifyToken);

// 주문 완료 처리 (POST /api/orders/complete)
router.post('/complete', completeOrder);
router.get('/', getMyOrders);

export default router;