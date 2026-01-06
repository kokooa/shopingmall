"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  // 로그인 상태 관리 (처음엔 로그인 안 된 상태로 가정)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 페이지가 로드되면 토큰이 있는지 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    // 토큰이 있으면 로그인 된 상태로 변경
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoggedIn(true);
    }
  }, []);

  // 로그아웃 함수
  const handleLogout = () => {
    // 저장된 토큰과 유저 정보 삭제
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    
    alert("로그아웃 되었습니다.");
    setIsLoggedIn(false); // 상태 변경
    window.location.reload(); // 깔끔하게 새로고침
  };

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      
      {/* 1. 상단 네비게이션 바 */}
      <nav className="fixed w-full z-20 top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="container flex items-center justify-between px-6 py-4 mx-auto">
          <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition">
            My Shop
          </Link>
          
          <div className="hidden md:flex space-x-8 font-medium text-gray-600">
              <Link href="/products/all" className="hover:text-black transition">ALL</Link>
              <Link href="/products/outer" className="hover:text-black transition">OUTER</Link>
              <Link href="/products/top" className="hover:text-black transition">TOP</Link>
              <Link href="/products/bottom" className="hover:text-black transition">BOTTOM</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            
            {/* ⭐ [추가됨] 장바구니 아이콘 버튼 */}
            <Link href="/cart" className="text-gray-600 hover:text-black transition relative group">
                <div className="p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                </div>
            </Link>

            {/* 기존 로그인/로그아웃 버튼 로직 */}
            {isLoggedIn ? (
              <>
                 <button 
                   onClick={handleLogout}
                   className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 border border-gray-200"
                 >
                   로그아웃
                 </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform rounded-lg hover:bg-gray-100">
                  로그인
                </Link>
                <Link href="/signup" className="px-4 py-2 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 shadow-md">
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 2. 메인 배너 */}
      <section className="pt-32 pb-12 bg-gray-50">
        <div className="container px-6 mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 md:text-5xl leading-tight">
              백엔드 개발자가 만든<br />
              <span className="text-blue-600">가장 완벽한 쇼핑몰</span>
            </h1>
            <p className="mt-6 text-gray-500 text-lg">
              Next.js 프론트엔드와 Express 백엔드의 강력한 연동.<br/>
              빠르고 안정적인 쇼핑 경험을 제공합니다.
            </p>
            <div className="mt-8 flex justify-center gap-4">
               <Link href="/products/all" className="px-8 py-3 font-medium text-white transition duration-300 transform bg-blue-600 rounded-full hover:bg-blue-500 hover:scale-105 shadow-lg">
                  쇼핑 시작하기
               </Link>
            </div>
          </div>
          
          <div className="flex justify-center mt-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              className="object-cover w-full h-64 sm:h-96 rounded-2xl shadow-2xl lg:w-4/5" 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80" 
              alt="Shopping Banner" 
            />
          </div>
        </div>
      </section>

      {/* 3. 상품 목록 예시 */}
      <section className="bg-white py-16">
        <div className="container px-6 mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                MD 추천 상품
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="group relative">
                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=60`} alt="Product" className="h-full w-full object-cover object-center lg:h-full lg:w-full" />
                        </div>
                        <div className="mt-4 flex justify-between">
                            <div>
                                <h3 className="text-sm text-gray-700">
                                    <a href="#">
                                        <span aria-hidden="true" className="absolute inset-0"></span>
                                        멋진 상품 {item}
                                    </a>
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">Black</p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">₩35,000</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>
      
    </div>
  );
}