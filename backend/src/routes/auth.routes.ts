import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { verifyToken } from '../common/middlewares';

const router = Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me (순서 중요! 로그인 체크 미들웨어 필요)
router.get('/me', verifyToken, getMe);

export default router;