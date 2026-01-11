import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// ✅ TypeScript용 타입 확장
// express의 Request 객체 안에 'user' 속성이 원래는 없어서 강제로 추가해주는 코드입니다.
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number; // 혹은 string (DB 타입에 맞춰서)
        role: string;
        email: string;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'; // .env에 꼭 JWT_SECRET 설정하세요!

// 1. 로그인 여부 확인 (토큰 검증)
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 헤더에서 토큰 추출: "Bearer <token>" 형태
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const token = authHeader.split(' ')[1]; // "Bearer" 뒤의 토큰만 가져옴

    if (!token) {
      return res.status(401).json({ message: "토큰 형식이 올바르지 않습니다." });
    }

    // 토큰 검증
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string; email: string };
    
    // 검증 성공 시, req.user에 정보 담기 (다음 미들웨어에서 쓰라고)
    req.user = decoded;
    
    next(); // 다음 단계로 통과!

  } catch (error) {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};

// 2. 관리자 권한 확인 (verifyToken 뒤에 써야 함)
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // verifyToken을 통과했다면 req.user가 존재함
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: "관리자 권한이 없습니다." });
  }

  next(); // 관리자 맞네? 통과!
};