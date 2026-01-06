"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AdminUploadPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'outer',
    imageUrl: '',
    description: ''
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 백엔드로 전송
      await axios.post('http://localhost:4000/api/products', formData);
      alert('상품이 등록되었습니다!');
      router.push('/products/all'); // 등록 후 목록으로 이동
    } catch (error) {
      alert('등록 실패');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">상품 등록 (ADMIN)</h2>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            
            {/* 상품명 */}
            <div>
              <label className="text-sm font-medium text-gray-700">상품명</label>
              <input name="name" type="text" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="예: 오버핏 트렌치 코트" onChange={handleChange} />
            </div>

            {/* 가격 */}
            <div>
              <label className="text-sm font-medium text-gray-700">가격 (원)</label>
              <input name="price" type="number" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="35000" onChange={handleChange} />
            </div>

            {/* 카테고리 */}
            <div>
              <label className="text-sm font-medium text-gray-700">카테고리</label>
              <select name="category" className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" onChange={handleChange}>
                <option value="outer">Outer</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>

            {/* 이미지 URL */}
            <div>
              <label className="text-sm font-medium text-gray-700">이미지 URL (Unsplash 등)</label>
              <input name="imageUrl" type="text" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="https://..." onChange={handleChange} />
            </div>

             {/* 설명 */}
             <div>
              <label className="text-sm font-medium text-gray-700">상품 설명</label>
              <textarea name="description" rows={3} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="상품에 대한 설명..." onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
            상품 등록하기
          </button>
        </form>
      </div>
    </div>
  );
}