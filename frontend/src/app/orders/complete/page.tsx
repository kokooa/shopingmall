"use client";

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

function OrderCompleteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderId) {
      // 주문 번호 없이 들어오면 메인으로 쫓아냄
      router.replace('/');
    }
  }, [orderId, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center animate-fade-in-up">
        
        {/* 성공 아이콘 */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
        <p className="text-gray-500 mb-8">주문이 성공적으로 완료되었습니다.</p>

        <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left text-sm">
            <div className="flex justify-between mb-2">
                <span className="text-gray-500">주문 번호</span>
                <span className="font-mono font-bold text-gray-900">#{orderId}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500">배송 상태</span>
                <span className="text-blue-600 font-bold">결제 완료 (상품 준비중)</span>
            </div>
        </div>

        <div className="space-y-3">
            <Link 
                href="/products/all" 
                className="block w-full py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition"
            >
                쇼핑 계속하기
            </Link>
            <Link 
                href="/mypage" // 나중에 만들 마이페이지
                className="block w-full py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition"
            >
                주문 내역 확인하기
            </Link>
        </div>

      </div>
    </div>
  );
}

export default function OrderCompletePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderCompleteContent />
    </Suspense>
  );
}