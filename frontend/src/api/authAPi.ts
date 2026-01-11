import api from './axios';

// 회원가입 데이터 타입 정의
interface SignupData {
  email: string;
  password: string;
  name: string;
}

// 회원가입 함수
export const signUp = async (data: SignupData) => {
  // baseURL이 'http://localhost:4000/api'로 설정돼 있으므로
  // 뒤에 '/auth/register'만 붙이면 됩니다.
  // (백엔드 라우터 주소와 정확히 일치해야 함!)
  const response = await api.post('/api/auth/register', data);
  return response.data;
};