"use client";

import React, { useEffect, useState } from 'react';
import api from '@/api/axios';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/admin/orders');
      // 데이터가 배열인지 확인하고 넣기 (안전장치)
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        alert("관리자 권한이 필요합니다.");
        router.push('/');
      } else {
        console.error("데이터 로딩 실패", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    if (!confirm(`주문 상태를 [${newStatus}]로 변경하시겠습니까?`)) return;
    
    try {
      await api.patch(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      alert("상태가 변경되었습니다.");
      fetchOrders(); 
    } catch (error) {
      alert("변경 실패");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        
        {/* 상단 헤더 & 버튼 영역 */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-gray-800">ADMIN DASHBOARD</h1>

            <div className="flex items-center gap-3">
                <button 
                    onClick={() => router.push('/admin/product/new')}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700 transition shadow-sm flex items-center"
                >
                    {/* 플러스 아이콘 추가 */}
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    상품 등록
                </button>
                <span className="bg-black text-white px-4 py-2 rounded text-sm font-bold">Manager Mode</span>
            </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                <h3 className="text-gray-500 text-sm font-bold">총 주문 건수</h3>
                <p className="text-3xl font-bold mt-2">{orders.length}건</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                <h3 className="text-gray-500 text-sm font-bold">결제 완료 (배송 전)</h3>
                <p className="text-3xl font-bold mt-2 text-green-600">
                    {orders.filter(o => o.status === 'PAID').length}건
                </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
                 <h3 className="text-gray-500 text-sm font-bold">취소됨</h3>
                 <p className="text-3xl font-bold mt-2 text-red-500">
                    {orders.filter(o => o.status === 'CANCELLED').length}건
                </p>
            </div>
        </div>

        {/* 주문 목록 테이블 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
            {orders.length === 0 ? (
                // 주문이 없을 때 보여줄 화면
                <div className="p-10 text-center text-gray-500">
                    아직 주문 내역이 없습니다.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주문번호 / 날짜</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구매자</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품 정보</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">총 금액</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태 관리</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-gray-900">{order.merchantUid}</div>
                                <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{order.user?.name || 'Unknown'}</div>
                                <div className="text-xs text-gray-500">{order.user?.email}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                    {/* ⭐ 여기가 제일 중요! ?. 를 써서 에러 방지 */}
                                    {order.orderItems?.[0]?.product?.name || "상품 정보 없음"}
                                    {order.orderItems?.length > 1 && ` 외 ${order.orderItems.length - 1}건`}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                {order.totalAmount?.toLocaleString()}원
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <select 
                                    value={order.status} 
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    className={`text-sm font-bold border rounded p-1 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500
                                        ${order.status === 'PAID' ? 'text-blue-600 border-blue-200 bg-blue-50' : ''}
                                        ${order.status === 'SHIPPED' ? 'text-purple-600 border-purple-200 bg-purple-50' : ''}
                                        ${order.status === 'DELIVERED' ? 'text-gray-500 border-gray-200 bg-gray-50' : ''}
                                        ${order.status === 'CANCELLED' ? 'text-red-500 border-red-200 bg-red-50' : ''}
                                    `}
                                >
                                    <option value="PENDING">입금대기</option>
                                    <option value="PAID">결제완료</option>
                                    <option value="SHIPPED">배송중</option>
                                    <option value="DELIVERED">배송완료</option>
                                    <option value="CANCELLED">주문취소</option>
                                </select>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}