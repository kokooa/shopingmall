"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios'; // 👈 통신 도구
import { useRouter } from 'next/navigation'; // 👈 페이지 이동 도구

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SignupPage() {
  const router = useRouter(); // 이동 도구 장전
  
  // 백엔드 DB 스키마에 맞춰서 변수명 설정 (name, email, password)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다!");
      return;
    }

    try {
      // ⭐ 백엔드(8080)로 회원가입 요청 발사!
      const response = await axios.post('${API_URL}/api/users/signup', {
        name: name,
        email: email,
        password: password
      });

      console.log("회원가입 성공:", response.data);
      alert("회원가입이 완료되었습니다! 로그인해주세요.");
      
      // 성공 시 로그인 페이지로 이동
      router.push('/login'); 

    } catch (error: any) {
      console.error("회원가입 실패:", error);
      // 백엔드에서 보낸 에러 메시지 띄우기 (없으면 기본 메시지)
      alert(error.response?.data?.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 p-6">
        {/* ... (디자인 코드는 기존과 동일, 생략 없이 그대로 두세요) ... */}
        {/* 디자인 코드가 필요하면 아까 드린 코드 그대로 유지하면 됩니다. 
            바뀐 건 위쪽 handleSubmit 부분입니다. */}
            
            {/* ... 폼 부분 ... */}
            <form onSubmit={handleSubmit} className="mt-6">
             <div className="w-full mt-4">
              <input
                type="text"
                placeholder="이름 (Name)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            
            <div className="w-full mt-4">
              <input
                type="email"
                placeholder="이메일 (Email)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            {/* ... 비밀번호 입력창들 (기존 유지) ... */}
             <div className="w-full mt-4">
              <input
                type="password"
                placeholder="비밀번호 (Password)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="w-full mt-4">
              <input
                type="password"
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div className="flex items-center justify-between mt-6">
              <Link href="/login" className="text-sm text-gray-600 dark:text-gray-200 hover:text-gray-500">
                이미 계정이 있으신가요?
              </Link>
              <button className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                가입하기
              </button>
            </div>
          </form>
      </div>
    </div>
  );
}