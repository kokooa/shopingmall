"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import Image from "next/image"; 
import { useRouter } from 'next/navigation';
import { getProducts } from "../api/productAPi";

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) setIsLoggedIn(true);

    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProducts(data.list || []); 
      } catch (error) {
        console.error("상품 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    alert("로그아웃 되었습니다.");
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      
      {/* 1. 네비게이션 바 (투명 -> 스크롤 시 변경 효과 등은 추후 고도화 가능) */}
      <nav className="fixed w-full z-50 top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="container flex items-center justify-between px-6 py-4 mx-auto">
          {/* 로고: 심플하고 모던하게 */}
          <Link href="/" className="text-2xl font-black tracking-tighter hover:opacity-80 transition">
            MUSE
          </Link>
          
          <div className="hidden md:flex space-x-10 text-sm font-semibold tracking-wide">
              <Link href="/products/all" className="hover:text-gray-500 transition">SHOP ALL</Link>
              <Link href="/products/outer" className="hover:text-gray-500 transition">OUTER</Link>
              <Link href="/products/top" className="hover:text-gray-500 transition">TOP</Link>
              <Link href="/products/bottom" className="hover:text-gray-500 transition">BOTTOM</Link>
          </div>
          
          <div className="flex items-center space-x-5">
             <Link href="/cart" className="hover:text-gray-500 transition relative">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
            </Link>

            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="text-sm font-medium hover:text-gray-500 transition"
              >
                LOGOUT
              </button>
            ) : (
              <Link href="/login" className="text-sm font-medium hover:text-gray-500 transition">
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* 2. 메인 배너 (Hero) - 진짜 패션 브랜드처럼 */}
      <section className="relative w-full h-[90vh] flex items-center justify-center bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
            <Image 
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
              alt="Season Collection"
              fill
              className="object-cover object-center brightness-90"
              priority
            />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 animate-fade-in-up">
            <p className="text-sm md:text-base font-medium tracking-[0.2em] mb-4 uppercase text-gray-200">
                2026 Spring / Summer
            </p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 drop-shadow-lg">
                MINIMAL & UNIQUE
            </h1>
            <Link 
                href="/products/all" 
                className="inline-block px-10 py-4 bg-white text-black text-sm font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-300"
            >
                Shop Collection
            </Link>
        </div>
      </section>

      {/* 3. 서비스 특징 (배송, CS 등 - 리얼리티 부여) */}
      <section className="py-10 border-b border-gray-100">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
             <div className="space-y-2">
                 <div className="flex justify-center mb-2">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                 </div>
                 <h3 className="font-bold text-sm uppercase">Authentic Quality</h3>
                 <p className="text-xs text-gray-500">엄선된 소재와 디자인</p>
             </div>
             <div className="space-y-2">
                 <div className="flex justify-center mb-2">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <h3 className="font-bold text-sm uppercase">Fast Shipping</h3>
                 <p className="text-xs text-gray-500">오후 2시 이전 주문 당일 발송</p>
             </div>
             <div className="space-y-2">
                 <div className="flex justify-center mb-2">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                 </div>
                 <h3 className="font-bold text-sm uppercase">Secure Payment</h3>
                 <p className="text-xs text-gray-500">안전한 결제 시스템</p>
             </div>
        </div>
      </section>

      {/* 4. 상품 목록 (DB 연동) */}
      <section className="py-24 bg-white">
        <div className="container px-6 mx-auto">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
                    <p className="text-gray-500 text-sm mt-1">이번 시즌 주목해야 할 아이템</p>
                </div>
                <Link href="/products/all" className="text-sm font-medium underline decoration-gray-300 hover:decoration-black underline-offset-4 transition">
                    View All
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4"></div>
                            <div className="h-4 bg-gray-200 w-3/4 mb-2 rounded"></div>
                            <div className="h-4 bg-gray-200 w-1/4 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-32 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 mb-6">준비된 상품이 없습니다.</p>
                    <Link href="/admin/upload" className="px-6 py-3 bg-black text-white text-sm font-bold rounded hover:bg-gray-800">
                        관리자 상품 등록
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {products.map((product) => (
                        <Link href={`/products/${product.id}`} key={product.id} className="group">
                            <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 rounded-lg mb-4">
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* 품절 표시 등 나중에 추가 가능 */}
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-sm font-medium text-gray-900 group-hover:underline decoration-1 underline-offset-4">
                                    {product.name}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                                <p className="text-sm font-bold text-gray-900 mt-2">
                                    {Number(product.price).toLocaleString()}원
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
      </section>

      {/* 4-2. Category Collection */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold mb-10 text-center uppercase tracking-widest">Shop by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/products/outer" className="group relative h-96 overflow-hidden">
                    <Image 
                        src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop" 
                        alt="Outer" 
                        fill 
                        className="object-cover transition duration-700 group-hover:scale-110 brightness-75 group-hover:brightness-90" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-3xl font-bold border-b-2 border-transparent group-hover:border-white pb-2 transition-all uppercase tracking-widest">Outer</span>
                    </div>
                </Link>
                 <Link href="/products/top" className="group relative h-96 overflow-hidden">
                    <Image 
                        src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1000&auto=format&fit=crop" 
                        alt="Top" 
                        fill 
                        className="object-cover transition duration-700 group-hover:scale-110 brightness-75 group-hover:brightness-90" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-3xl font-bold border-b-2 border-transparent group-hover:border-white pb-2 transition-all uppercase tracking-widest">Top</span>
                    </div>
                </Link>
                 <Link href="/products/bottom" className="group relative h-96 overflow-hidden">
                    <Image 
                        src="https://images.unsplash.com/photo-1542272617-08f08637533e?q=80&w=1000&auto=format&fit=crop" 
                        alt="Bottom" 
                        fill 
                        className="object-cover transition duration-700 group-hover:scale-110 brightness-75 group-hover:brightness-90" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-3xl font-bold border-b-2 border-transparent group-hover:border-white pb-2 transition-all uppercase tracking-widest">Bottom</span>
                    </div>
                </Link>
            </div>
        </div>
      </section>

      {/* 4-3. Best Sellers */}
      <section className="py-24 bg-white">
         <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">BEST SELLERS</h2>
                <p className="text-gray-500">지금 가장 사랑받는 아이템</p>
            </div>
            
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                     {/* Loading Skeleton */}
                     {[1,2,3,4].map(i => (
                        <div key={i} className="bg-gray-100 h-80 w-full animate-pulse rounded-lg"></div>
                     ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* 보여줄 데이터가 없으면 Mock Data라도 보여줘서 UI 확인 (실제로는 products 사용) */}
                    {(products.length > 0 ? products.slice(0, 4).reverse() : []).map((product) => (
                         <Link href={`/products/${product.id}`} key={`best-${product.id}`} className="group block">
                            <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 rounded-lg mb-4">
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                                    Best
                                </div>
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 group-hover:underline decoration-1 underline-offset-4 mb-1">
                                {product.name}
                            </h3>
                            <p className="text-sm font-bold text-gray-900">
                                {Number(product.price).toLocaleString()}원
                            </p>
                         </Link>
                    ))}
                    
                    {/* 데이터가 없을 때를 대비한 Empty State (선택사항) */}
                    {products.length === 0 && !loading && (
                        <div className="col-span-full text-center text-gray-400 py-10">
                            베스트 상품을 준비 중입니다.
                        </div>
                    )}
                </div>
            )}
         </div>
      </section>

      {/* 5. 하단 프로모션 배너 */}
      <section className="py-20 bg-black text-white text-center">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold mb-4">Sign up for Newsletter</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    신규 회원 가입 시 10% 할인 쿠폰을 드립니다. 다양한 혜택과 소식을 가장 먼저 받아보세요.
                </p>
                <div className="flex max-w-sm mx-auto gap-2">
                    <input type="email" placeholder="Your email address" className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-white transition" />
                    <button className="px-6 py-3 bg-white text-black font-bold text-sm hover:bg-gray-200 transition">SUBSCRIBE</button>
                </div>
            </div>
      </section>

      {/* 6. Footer (사이트 정보) */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div>
                  <h4 className="font-bold text-lg mb-4">MUSE</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                      Everyday Luxury.<br/>
                      당신의 일상을 특별하게 만드는<br/>
                      미니멀 라이프스타일 브랜드
                  </p>
              </div>
              <div>
                  <h4 className="font-bold text-sm mb-4 uppercase">Help</h4>
                  <ul className="space-y-2 text-sm text-gray-500">
                      <li><a href="#" className="hover:text-black">고객센터</a></li>
                      <li><a href="#" className="hover:text-black">배송 안내</a></li>
                      <li><a href="#" className="hover:text-black">반품 / 교환</a></li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold text-sm mb-4 uppercase">Info</h4>
                  <ul className="space-y-2 text-sm text-gray-500">
                      <li><a href="#" className="hover:text-black">이용약관</a></li>
                      <li><a href="#" className="hover:text-black">개인정보처리방침</a></li>
                      <li><a href="#" className="hover:text-black">사업자 정보 확인</a></li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold text-sm mb-4 uppercase">Contact</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                      070-1234-5678<br/>
                      help@muse-shop.com<br/>
                      Mon - Fri, 10am - 6pm
                  </p>
              </div>
          </div>
          <div className="container mx-auto px-6 border-t border-gray-100 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
              <p className="text-xs text-gray-400">© 2026 MUSE Inc. All rights reserved.</p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                  {/* SNS 아이콘 자리 */}
                  <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                  <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                  <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
              </div>
          </div>
      </footer>
    </div>
  );
}