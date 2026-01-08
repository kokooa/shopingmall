"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    alert("로그아웃 되었습니다.");
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      
      {/* 1. 네비게이션 바 */}
      <nav className="fixed w-full z-50 top-0 bg-gradient-to-b from-black/60 to-transparent border-b border-white/10 text-white">
        <div className="container flex items-center justify-between px-6 py-4 mx-auto">
          <Link href="/" className="text-xl font-bold hover:text-gray-300 transition">
            쇼핑몰 예시 페이지입니다
          </Link>
          
          <div className="hidden md:flex space-x-8 text-sm font-medium">
              <Link href="/products/all" className="hover:text-gray-300 transition">ALL</Link>
              <Link href="/products/outer" className="hover:text-gray-300 transition">OUTER</Link>
              <Link href="/products/top" className="hover:text-gray-300 transition">TOP</Link>
              <Link href="/products/bottom" className="hover:text-gray-300 transition">BOTTOM</Link>
          </div>
          
          <div className="flex items-center space-x-4">
             <Link href="/cart" className="hover:text-gray-300 transition relative group">
                <div className="p-2 rounded-full hover:bg-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                </div>
            </Link>

            {isLoggedIn ? (
              <>
                 <span className="text-xs hidden sm:inline opacity-80">환영합니다</span>
                 <button 
                   onClick={handleLogout}
                   className="px-3 py-1.5 text-xs font-medium transition-colors duration-300 transform rounded border border-white/50 hover:bg-white/10"
                 >
                   로그아웃
                 </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-3 py-1.5 text-xs font-medium transition-colors duration-300 transform rounded hover:bg-white/10">
                  로그인
                </Link>
                <Link href="/signup" className="px-3 py-1.5 text-xs font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded hover:bg-blue-500 shadow-sm">
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ⭐ 2. 메인 배너 (Hero Section) ⭐ */}
      <section className="relative w-full h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
        
        {/* 배경 이미지 (고정) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          className="absolute inset-0 w-full h-full object-cover object-center"
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
          alt="Shopping Banner" 
        />
        
        {/* 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* 텍스트 컨텐츠: mt-32 추가로 위치를 아래로 내림 */}
        <div className="relative z-10 container px-6 mx-auto text-center text-white mt-50 pb-10">
          <div className="max-w-3xl mx-auto">
            {/* 제목 */}
            <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
              <span className="block text-black-500 mb-2 text-xl md:text-2xl font-semibold">Backend 출신의 Full Stack engineer</span>
              당신만의 개성있는 쇼핑몰을 만들어보세요
            </h1>
            
            {/* 설명글 */}
            <p className="mt-6 text-gray-200 text-base md:text-xl leading-relaxed font-normal opacity-90">
              최신 기술 Stack을 사용해 최적화된 서비스를 제공합니다<br/>
              Backend 로직 구현을 통한 보안 까지.
            </p>
            
            {/* 버튼 */}
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
               <Link href="/products/all" className="px-8 py-3 text-base font-semibold text-white transition duration-300 transform bg-blue-600 rounded-full hover:bg-blue-500 hover:scale-105 shadow-lg">
                  쇼핑 시작하기
               </Link>
               {!isLoggedIn && (
                <Link href="/signup" className="px-8 py-3 text-base font-semibold text-white transition duration-300 transform border border-white/70 rounded-full hover:bg-white hover:text-black hover:scale-105">
                    회원가입
                </Link>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. 상품 목록 예시 (유지) */}
      <section className="bg-white py-20">
        <div className="container px-6 mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">
                MD 추천 상품
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="group relative">
                        <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80 relative shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={`https://images.unsplash.com/photo-${item === 1 ? '1591047139829-d91aecb6caea' : item === 2 ? '1523205771623-e0faa4d2813d' : item === 3 ? '1521572163474-6864f9cf17ab' : '1506629082955-511b1aa00218'}?auto=format&fit=crop&w=500&q=60`} alt="Product" className="h-full w-full object-cover object-center lg:h-full lg:w-full" />
                        </div>
                        <div className="mt-4 flex justify-between">
                            <div>
                                <h3 className="text-base font-medium text-gray-900">
                                    <Link href="/products/all">
                                        <span aria-hidden="true" className="absolute inset-0"></span>
                                        추천 상품 {item}
                                    </Link>
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">Premium Quality</p>
                            </div>
                            <p className="text-base font-bold text-gray-900">₩{ (30000 + item * 5000).toLocaleString() }</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>
      
    </div>
  );
}