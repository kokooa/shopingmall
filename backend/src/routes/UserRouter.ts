// backend/src/routes/UserRouter.ts

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// 1. 회원가입 (POST /api/users/signup)
// ==========================================
router.post('/signup', async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        // 이미 있는 이메일인지 확인
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (existingUser) {
            return res.status(400).json({ message: "이미 가입된 이메일입니다." });
        }

        // 유저 생성 (비밀번호 암호화는 일단 생략하고 그대로 저장)
        const newUser = await prisma.user.create({
            data: {
                email,
                password, // 실무에선 bcrypt로 암호화 필수!
                name
            }
        });

        return res.status(201).json({ message: "회원가입 성공!", user: newUser });

    } catch (error) {
        console.error("회원가입 에러:", error);
        return res.status(500).json({ message: "서버 에러가 발생했습니다." });
    }
});

// ==========================================
// 2. 로그인 (POST /api/users/login)
// ==========================================
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 1. 이메일로 유저 찾기
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        // 2. 유저가 없거나 비밀번호가 틀리면 에러
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "이메일 또는 비밀번호가 틀렸습니다." });
        }

        // 3. 로그인 성공! (토큰과 유저 정보 리턴)
        // ⭐ 여기서 user.id를 보내줘야 프론트에서 장바구니에 담을 수 있음!
        return res.status(200).json({
            message: "로그인 성공",
            token: "real-db-token-12345", // 나중엔 JWT로 교체
            user: {
                id: user.id,      // 👈 핵심!
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.error("로그인 에러:", error);
        return res.status(500).json({ message: "서버 에러" });
    }
});

export default router;