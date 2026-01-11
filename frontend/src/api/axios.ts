import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  // headers: {
  //   'Content-Type': 'application/json',
  // },
  withCredentials: true,
});

// ✅ [핵심] 요청 인터셉터 추가 (갈 때 토큰 챙겨가!)
api.interceptors.request.use(
  (config) => {
    // 1. 로컬 스토리지에서 토큰 꺼내기
    // (로그인할 때 'token'이라는 이름으로 저장했다고 가정)
    const token = localStorage.getItem('token');

    // 2. 토큰이 있으면 헤더에 심어주기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default api;