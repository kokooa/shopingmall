import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

// 회원가입
export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.register(req.body);
    // 비밀번호는 제외하고 응답하는 것이 보안상 좋음
    return res.status(201).json({ message: "회원가입 성공", userId: user.id });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// 로그인
export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
};

// 내 정보 조회
export const getMe = async (req: Request, res: Response) => {
  try {
    // verifyToken 미들웨어가 req.user.id를 넣어줌
    const userId = req.user?.id;
    if (!userId) throw new Error("로그인이 필요합니다.");

    const user = await authService.getMe(userId);
    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

