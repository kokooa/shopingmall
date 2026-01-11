import { PrismaClient } from '@prisma/client';

// 전역 객체에 prisma가 있는지 확인하기 위한 타입 선언
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 기존에 만들어진 게 있으면 그걸 쓰고, 없으면 새로 만듦 (싱글톤 패턴)
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // 개발 중에는 쿼리 로그를 보면 디버깅하기 편합니다.
    log: [ 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;