import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

export class AuthService {
  private userRepository = new UserRepository();

  // 회원가입 로직
  async register(body: any) {
    const { email, password, name } = body;

    // 1. 이미 존재하는 이메일인지 확인
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("이미 사용 중인 이메일입니다.");
    }

    // 2. 비밀번호 암호화 (해싱)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. 유저 생성 요청
    return await this.userRepository.createUser({
      email,
      password: hashedPassword,
      name,
    });
  }

  // 로그인 로직
  async login(body: any) {
    const { email, password } = body;

    // 1. 유저 확인
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("이메일 또는 비밀번호가 잘못되었습니다.");
    }

    // 2. 비밀번호 일치 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("이메일 또는 비밀번호가 잘못되었습니다.");
    }

    // 3. ✅ 토큰 발급 (여기에 Role을 넣는 것이 핵심!)
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role // ⭐ ADMIN 권한 체크를 위해 필수
      },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    return { token, user: { id: user.id, name: user.name, role: user.role } };
  }

  // 내 정보 조회 로직
  async getMe(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }
    return user;
  }
}