import { PrismaClient } from '@prisma/client';

export class UserRepository {
  private prisma = new PrismaClient();

  // 이메일로 유저 찾기
  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  // 유저 생성 (회원가입)
  async createUser(data: any) {
    return await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password, // 이미 암호화된 비밀번호가 넘어옴
        name: data.name,
        role: 'USER', // 기본 가입은 무조건 USER
      },
    });
  }

  // ID로 유저 찾기 (비밀번호 제외하고 반환)
  async findById(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true, // ✅ role 정보 필수
        createdAt: true,
      },
    });
  }
}