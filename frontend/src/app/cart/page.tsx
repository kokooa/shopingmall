"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script'; // 👈 포트원 스크립트 로드용
import { useRouter } from 'next/navigation';
import { getCartItems, removeCartItem, updateCartItem } from '@/api/cartApi';
import api from '../../api/axios';

// TypeScript에서 window.IMP를 인식하도록 선언
declare global {
  interface Window {
    IMP: any;
  }
}

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

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 데이터 불러오기
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('accessToken'); // 혹은 'token'
      if (!token) {
        // 로그인 안 되어 있으면 로그인 페이지로
        return; 
      }
      const data = await getCartItems();
      setCartItems(Array.isArray(data) ? data : data.list || []);
    } catch (error) {
      console.error("장바구니 로딩 실패", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId: number, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;
    try {
      setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQty } : item));
      await updateCartItem(itemId, newQty);
    } catch (error) {
      console.error(error);
      fetchCart();
    }
  };

  const handleRemove = async (itemId: number) => {
    if (!confirm("삭제하시겠습니까?")) return;
    try {
      await removeCartItem(itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error(error);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0);
  const shippingCost = subtotal > 50000 ? 0 : 3000;
  const total = subtotal + shippingCost;

  // ⭐⭐⭐ [핵심] 결제 요청 함수 ⭐⭐⭐
  const requestPay = () => {
    if (!window.IMP) return;

    const impCode = process.env.NEXT_PUBLIC_PORTONE_IMP_CODE;
    
    console.log("내 식별코드:", impCode); 

    if (!impCode) {
      alert("식별코드를 못 불러왔습니다! .env 확인 필요");
      return;
    }

    // 1. 초기화 (본인의 가맹점 식별코드를 넣으세요!)
    const { IMP } = window;
    IMP.init(impCode); // 👈 여기를 포트원 관리자 페이지에서 복사한 코드로 변경!!

    // 2. 주문명 만들기 (예: "오버핏 코트 외 2건")
    let orderName = "주문 상품";
    if (cartItems.length > 0) {
        orderName = cartItems[0].product.name;
        if (cartItems.length > 1) {
            orderName += ` 외 ${cartItems.length - 1}건`;
        }
    }

    // 3. 결제 데이터 설정
    const data = {
      pg: 'kakaopay',            // PG사 (kakaopay, html5_inicis, tosspay 등)
      pay_method: 'card',         // 결제수단
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호 (나중엔 백엔드에서 생성해야 함)
      name: orderName,            // 주문명
      amount: total,              // 결제금액
      buyer_email: 'test@portone.io', // 구매자 이메일 (나중엔 로그인 유저 정보 넣기)
      buyer_name: '테스트 유저',      // 구매자 이름
      buyer_tel: '010-1234-5678',     // 구매자 전화번호
    };

    // 4. 결제 창 호출
    IMP.request_pay(data, callback);
  };

  // 5. 결제 결과 처리 콜백
  const callback = async (response: any) => {
    const { success, error_msg, imp_uid, merchant_uid } = response;

    if (success) {
      try {
        const res = await api.post('/api/orders/complete', { // /api 붙인거 유지!
           imp_uid,
           merchant_uid
      });
        
        const orderId = res.data.orderId;

        alert("주문이 성공적으로 완료되었습니다!");

        router.push(`/orders/complete?orderId=${orderId}`);
        
      } catch (error) {
        console.error(error);
        alert("결제는 성공했으나 주문 저장에 실패했습니다. 고객센터로 문의해주세요.");
      }
    } else {
      alert(`결제 실패: ${error_msg}`);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="bg-white min-h-screen pt-24 pb-20 font-sans">
      
      {/* 👇 포트원 SDK 스크립트 로드 (필수) */}
      <Script 
        src="https://cdn.iamport.kr/v1/iamport.js" 
        strategy="lazyOnload" // 페이지 로드 후 천천히 불러오기
      />

      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-10 tracking-tight text-gray-900">SHOPPING BAG</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 border-t border-b border-gray-100">
            <p className="text-gray-500 mb-6 text-lg">장바구니가 비어있습니다.</p>
            <Link href="/products/all" className="inline-block px-8 py-3 bg-black text-white text-sm font-bold uppercase hover:bg-gray-800 transition">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* 왼쪽: 장바구니 목록 (기존 코드 유지) */}
            <div className="flex-1">
              <div className="border-t border-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex py-6 border-b border-gray-100 items-center">
                    <div className="relative w-24 h-32 flex-shrink-0 bg-gray-100 rounded overflow-hidden mr-6 cursor-pointer" onClick={() => router.push(`/products/${item.product.id}`)}>
                      <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900">{item.product.name}</h3>
                        <p className="text-sm font-bold text-gray-900">{Number(item.product.price * item.quantity).toLocaleString()}원</p>
                      </div>
                      <p className="text-xs text-gray-500 mb-4">{item.product.category}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center border border-gray-300 rounded">
                          <button onClick={() => handleQuantityChange(item.id, item.quantity, -1)} className="px-3 py-1 hover:bg-gray-100 text-gray-600">-</button>
                          <span className="px-3 py-1 text-sm font-medium min-w-[30px] text-center">{item.quantity}</span>
                          <button onClick={() => handleQuantityChange(item.id, item.quantity, 1)} className="px-3 py-1 hover:bg-gray-100 text-gray-600">+</button>
                        </div>
                        <button onClick={() => handleRemove(item.id)} className="text-xs text-gray-400 underline hover:text-red-500 transition">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 오른쪽: 결제 요약 (Checkout 버튼 연결) */}
            <div className="lg:w-96">
                <div className="bg-gray-50 p-8 rounded-lg sticky top-32">
                    <h2 className="text-lg font-bold mb-6 text-gray-900">Order Summary</h2>
                    <div className="flex justify-between mb-4 text-sm"><span className="text-gray-600">Subtotal</span><span className="font-medium">{subtotal.toLocaleString()}원</span></div>
                    <div className="flex justify-between mb-4 text-sm"><span className="text-gray-600">Shipping</span><span className="font-medium">{shippingCost === 0 ? 'Free' : `${shippingCost.toLocaleString()}원`}</span></div>
                    <div className="border-t border-gray-200 pt-4 mt-4 mb-8">
                        <div className="flex justify-between items-end">
                            <span className="font-bold text-gray-900">Total</span>
                            <span className="text-2xl font-bold text-gray-900">{total.toLocaleString()}원</span>
                        </div>
                    </div>

                    {/* ✅ Checkout 버튼에 requestPay 함수 연결 */}
                    <button 
                        onClick={requestPay}
                        className="w-full py-4 bg-[#FEE500] text-[#191919] font-bold text-sm uppercase hover:bg-[#FDD835] transition shadow-lg rounded"
                    >
                        카카오페이 결제하기
                    </button>
                </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}