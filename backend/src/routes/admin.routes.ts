import { Router } from 'express';
import { verifyToken, isAdmin } from '../common/middlewares'; // 👈 isAdmin 사용!
import { getAllOrders, updateOrderStatus, createProduct } from '../controllers/admin.controller';
import { upload } from '../utils/upload';

const router = Router();

// ⭐ 중요: 관리자 API는 무조건 [토큰 검사] -> [관리자 권한 검사] 순서로 통과해야 함
router.use(verifyToken, isAdmin);

// 1. 전체 주문 조회 (GET /api/admin/orders)
router.get('/orders', getAllOrders);

// 2. 주문 상태 변경 (PATCH /api/admin/orders/:id/status)
router.patch('/orders/:id/status', updateOrderStatus);

// 상품 등록 (이미지 1개 'image' 필드로 받음)
router.post('/products', upload.single('image'), createProduct);

export default router;