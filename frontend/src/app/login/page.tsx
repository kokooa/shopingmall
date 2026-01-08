"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 백엔드 주소 확인 필수
      const response = await axios.post(`${API_URL}/api/users/login`, {
        email: email,
        password: password
      });
      
      if (response.data.token) {
        localStorage.setItem('accessToken', response.data.token);
      }

      if (response.data.user && response.data.user.id) {
            localStorage.setItem('userId', String(response.data.user.id));
        }
      alert("로그인 되었습니다!");
      router.push('/');
    } catch (error: any) {
      console.error("로그인 실패:", error);
      const msg = error.response?.data?.message || "이메일 또는 비밀번호를 확인해주세요.";
      alert(msg);
    }
  };
  
  return (
    // 👇 dark:bg-gray-900 삭제 -> 무조건 흰색 배경
    <div className="w-full min-h-screen bg-white overflow-hidden text-gray-800">
      <div className="flex flex-row h-screen w-full">
        
        {/* 왼쪽 이미지 영역 */}
        <div className="relative w-[70%] bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/loginpage.jpg"
            alt="Login Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center px-12 z-10">
            <div className='relative bottom-60'>
              <h2 className="text-6xl font-bold text-white leading-tight">
                Cosmos
              </h2>
              <h2 className="text-3xl font-bold text-white leading-tight">
              The new sensuous passion
              </h2>
              <p className="mt-0 text-gray-200 text-lg">
                your passion mood
              </p>
            </div>
          </div>
        </div>

        {/* 오른쪽 로그인 폼 영역 */}
        {/* 👇 dark 관련 클래스 모두 삭제 */}
        <div className="w-[30%] flex items-center justify-center bg-white px-8 border-l border-gray-100">
          <div className="w-full max-w-sm">
            
            <div className="text-center mb-10">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src="https://merakiui.com/images/logo.svg" className="h-10 mx-auto" alt="Logo" />
               <h2 className="mt-4 text-2xl font-bold text-gray-800">Welcome Back</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-gray-900"
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">비밀번호</label>
                  <a href="#" className="text-sm text-blue-600 hover:underline">찾기</a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-gray-900"
                  placeholder="••••••••"
                />
              </div>

              <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-lg transform active:scale-95">
                로그인
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              계정이 없으신가요? <Link href="/signup" className="text-blue-600 font-semibold hover:underline">회원가입</Link>
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}