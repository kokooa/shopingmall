"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  
  // 1. 장바구니 목록 불러오기
  useEffect(() => {
    const fetchCart = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert("로그인이 필요합니다.");
        router.push('/login');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/cart/${userId}`);
        if (response.data && response.data.items) {
            setCartItems(response.data.items);
        }
      } catch (error) {
        console.error("장바구니 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [router]);

  // 2. 삭제 기능
  const removeItem = async (itemId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
        await axios.delete(`${API_URL}/api/cart/${itemId}`);
        setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
        alert("삭제 실패");
    }
  };

  // ⭐ [3. 수량 변경 기능] - 새로 추가됨
  const updateQuantity = async (itemId: number, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    
    // 1개 밑으로는 못 내려가게 막음
    if (newQty < 1) return;

    try {
        // (1) 화면부터 먼저 업데이트 (반응속도 빠르게 하기 위해)
        setCartItems(prev => prev.map(item => 
            item.id === itemId ? { ...item, quantity: newQty } : item
        ));

        // (2) 백엔드에 조용히 저장
        await axios.patch(`${API_URL}/api/cart/${itemId}`, {
            quantity: newQty
        });

    } catch (error) {
        console.error("수량 변경 실패:", error);
        alert("수량 변경에 실패했습니다.");
        // 실패하면 원래대로 돌리는 로직이 있으면 좋지만 일단 생략
    }
  };

  // 4. 총 가격 계산
  const totalPrice = cartItems.reduce((acc, item) => {
    return acc + (item.product.price * item.quantity);
  }, 0);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">My Shop</Link>
          <div className="font-bold text-lg">SHOPPING CART</div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-extrabold mb-8">장바구니 ({cartItems.length})</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">장바구니가 비어있습니다.</p>
            <Link href="/products/all" className="inline-block px-6 py-3 bg-black text-white rounded-md font-bold hover:bg-gray-800">
              쇼핑하러 가기
            </Link>
          </div>
        ) : (
          <div className="lg:flex lg:gap-12">
            
            <div className="lg:w-2/3 space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition bg-white items-center">
                  
                  {/* 이미지 */}
                  <div className="w-24 h-32 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  
                  {/* 정보 & 수량 조절 */}
                  <div className="flex-1 flex flex-col justify-between h-32 py-1">
                    <div>
                      <h3 className="font-bold text-lg">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">{item.product.category.toUpperCase()}</p>
                    </div>

                    <div className="flex justify-between items-end">
                      
                      {/* ⭐ 수량 조절 버튼 UI */}
                      <div className="flex items-center border border-gray-300 rounded">
                        <button 
                            onClick={() => updateQuantity(item.id, item.quantity, -1)}
                            className="px-3 py-1 hover:bg-gray-100 text-gray-600 disabled:opacity-30"
                            disabled={item.quantity <= 1} // 1개면 마이너스 버튼 비활성화
                        >
                            -
                        </button>
                        <span className="px-3 py-1 font-bold text-sm min-w-[30px] text-center border-x border-gray-300">
                            {item.quantity}
                        </span>
                        <button 
                            onClick={() => updateQuantity(item.id, item.quantity, 1)}
                            className="px-3 py-1 hover:bg-gray-100 text-gray-600"
                        >
                            +
                        </button>
                      </div>

                      <p className="font-bold text-lg">₩{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* 삭제 버튼 */}
                  <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 p-2 ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* 오른쪽: 주문 요약 */}
            <div className="lg:w-1/3 mt-8 lg:mt-0">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
                <h2 className="text-xl font-bold mb-6">주문 요약</h2>
                
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">총 상품 금액</span>
                  <span className="font-medium">₩{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-4">
                    <span className="text-gray-600">배송비</span>
                    <span className="font-medium">무료</span>
                </div>
                <div className="border-t border-gray-200 my-4 pt-4 flex justify-between">
                    <span className="text-lg font-bold">총 결제 금액</span>
                    <span className="text-xl font-bold text-blue-600">₩{totalPrice.toLocaleString()}</span>
                </div>

                <button 
                  onClick={() => alert("결제 시스템은 PG사 연동이 필요합니다.")}
                  className="w-full bg-black text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg mt-4"
                >
                  구매하기 ({cartItems.length}개)
                </button>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}