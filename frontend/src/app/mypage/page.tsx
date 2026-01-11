"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/api/axios';

// 타입 정의 (DB 구조에 맞춤)
interface OrderItem {
  id: number;
  product: {
    name: string;
    imageUrl: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  createdAt: string;
  status: string;
  totalAmount: number;
  merchantUid: string;
  orderItems: OrderItem[];
}

export default function MyPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // 백엔드: GET /api/orders
      const res = await api.get('/api/orders'); 
      setOrders(res.data);
    } catch (error) {
      console.error("주문 내역 로딩 실패", error);
    } finally {
      setLoading(false);
    }
  };

  // 날짜 포맷팅 함수 (예: 2023. 10. 25)
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  // 주문 상태 한글 변환
  const getStatusText = (status: string) => {
    switch(status) {
      case 'PAID': return '결제 완료';
      case 'PENDING': return '입금 대기';
      case 'CANCELLED': return '주문 취소';
      default: return status;
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-10 tracking-tight text-gray-900">MY ORDERS</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 border border-gray-100 rounded-lg bg-gray-50">
            <p className="text-gray-500 mb-6">주문 내역이 없습니다.</p>
            <Link href="/products/all" className="underline text-sm font-bold">쇼핑하러 가기</Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                {/* 주문 헤더 (날짜, 상세, 상태) */}
                <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100">
                  <div>
                    <span className="text-sm font-bold text-gray-900 mr-3">{formatDate(order.createdAt)}</span>
                    <span className="text-xs text-gray-500">주문번호 {order.merchantUid}</span>
                  </div>
                  <div className="mt-2 md:mt-0">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                        {getStatusText(order.status)}
                     </span>
                  </div>
                </div>

                {/* 주문 상품 목록 */}
                <div className="p-6">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center mb-6 last:mb-0">
                      <div className="relative w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0 mr-4">
                        <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{item.product.name}</h3>
                        <p className="text-xs text-gray-500 mb-1">{item.price.toLocaleString()}원 / {item.quantity}개</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* 총 결제 금액 */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end items-center">
                    <span className="text-sm text-gray-500 mr-3">총 결제금액</span>
                    <span className="text-xl font-bold text-gray-900">{order.totalAmount.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}