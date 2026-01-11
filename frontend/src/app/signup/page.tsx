"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '../../api/authAPi'; //

export default function SignupPage() {
  const router = useRouter();
  
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
      await signUp({
        name,
        email,
        password
      });

      alert("회원가입이 완료되었습니다! 로그인해주세요.");
      router.push('/login'); 

    } catch (error: any) {
      console.error("회원가입 실패:", error);
      // 에러 메시지 처리 (Global Error Handler가 보내준 메시지)
      const errorMessage = error.response?.data?.message || "회원가입 실패";
      alert(errorMessage);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 p-6">
        {/* ... 디자인 코드 유지 ... */}
         <form onSubmit={handleSubmit} className="mt-6">
             {/* ... input 태그들 그대로 유지 ... */}
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