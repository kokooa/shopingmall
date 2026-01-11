import { Router } from 'express';
import { verifyToken } from '../common/middlewares'; // 토큰 검사 미들웨어
import { 
  addToCart, 
  getMyCart, 
  updateCartItem, 
  deleteCartItem 
} from '../controllers/cart.controller';

const router = Router();

// 모든 장바구니 기능은 로그인이 필요함
router.use(verifyToken);

// 1. 장바구니 담기 (POST /api/cart)
router.post('/', addToCart);

// 2. 내 장바구니 조회 (GET /api/cart) - URL에 userId 노출 X (토큰으로 해결)
router.get('/', getMyCart);

// 3. 수량 변경 (PATCH /api/cart/:itemId)
router.patch('/:itemId', updateCartItem);

// 4. 아이템 삭제 (DELETE /api/cart/:itemId)
router.delete('/:itemId', deleteCartItem);

export default router;