"use client";

import { addToCart } from '../../../../api/cartApi';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // useRouter 필수!
import axios from 'axios';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  description: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter(); // 이동 도구
  const productId = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("상품 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  // ⭐ [핵심] 장바구니 담기 함수 수정
  const handleAddToCart = async () => {
    // 1. 로그인 체크 (토큰이 없으면 로그인 페이지로)
    const token = localStorage.getItem('accessToken'); // 혹은 'token'
    if (!token) {
        const confirmLogin = confirm("로그인이 필요한 기능입니다. 로그인 하시겠습니까?");
        if (confirmLogin) router.push('/login');
        return;
    }

    try {
        // ✅ [변경 2] axios.post 직접 호출 대신 API 함수 사용
        // (이 함수가 자동으로 헤더에 토큰을 실어 보냅니다)
        // 백엔드는 토큰에서 userId를 알 수 있으므로, userId를 따로 보낼 필요가 없습니다.
        await addToCart(Number(productId), 1);

        // 3. 성공 알림
        const goCart = confirm("장바구니에 담겼습니다! 장바구니로 이동할까요?");
        if (goCart) {
            router.push('/cart');
        }

    } catch (error: any) {
        console.error(error);
        // 에러 메시지 보여주기
        const msg = error.response?.data?.message || "장바구니 담기 실패";
        alert(msg);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return <div className="text-center py-20">상품을 찾을 수 없습니다.</div>;

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      
      {/* 네비게이션 */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">My Shop</Link>
          <Link href="/products/all" className="text-sm font-medium text-gray-600 hover:text-black">
            ← 목록으로 돌아가기
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <div className="lg:flex lg:gap-12">
          
          {/* 상품 이미지 */}
          <div className="lg:w-1/2">
            <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-200 shadow-lg">
               {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          {/* 상품 정보 및 구매 버튼 */}
          <div className="lg:w-1/2 mt-8 lg:mt-0 flex flex-col justify-center">
            <h2 className="text-sm text-gray-500 tracking-widest uppercase font-semibold">{product.category}</h2>
            <h1 className="text-4xl font-extrabold text-gray-900 mt-2">{product.name}</h1>
            <p className="text-3xl font-medium text-blue-600 mt-4">₩{Number(product.price).toLocaleString()}</p>
            
            <div className="mt-8 prose prose-sm text-gray-600 leading-relaxed">
              <p>{product.description || "이 상품은 최고의 퀄리티를 자랑합니다."}</p>
            </div>

            <div className="mt-10 flex gap-4">
              {/* 👇 여기가 수정된 부분입니다! onClick={addToCart} */}
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-white border-2 border-black text-black py-4 rounded-lg font-bold hover:bg-gray-50 transition transform active:scale-95"
              >
                장바구니 담기
              </button>
              
              <button 
                onClick={() => alert("구매 기능 준비중입니다.")}
                className="flex-1 bg-black text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition shadow-xl transform active:scale-95"
              >
                바로 구매하기
              </button>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}