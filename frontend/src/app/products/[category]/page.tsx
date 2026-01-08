"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axios from 'axios';

// 타입 정의 (DB 스키마와 일치)
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CategoryPage() {
  const params = useParams();
  const categoryName = params.category as string;
  
  // ⭐ [핵심] 이제 가짜 데이터 대신 state로 데이터를 관리합니다.
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 백엔드에서 데이터 가져오는 함수
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // category가 'all'이면 전체 조회, 아니면 해당 카테고리만 조회
        // 백엔드 API: GET ${API_URL}/api/products?category=...
        const response = await axios.get(`${API_URL}/api/products`, {
          params: { category: categoryName }
        });
        
        setProducts(response.data);
      } catch (error) {
        console.error("상품 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]); // 카테고리가 바뀔 때마다 다시 실행

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      
      {/* 상단 네비게이션 */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">My Shop</Link>
          <div className="flex gap-6 text-sm font-medium text-gray-600">
            <Link href="/products/all" className="hover:text-black">ALL</Link>
            <Link href="/products/outer" className="hover:text-black">OUTER</Link>
            <Link href="/products/top" className="hover:text-black">TOP</Link>
            <Link href="/products/bottom" className="hover:text-black">BOTTOM</Link>
          </div>
          <Link href="/admin/upload" className="px-4 py-2 bg-gray-100 text-gray-800 rounded text-sm font-bold hover:bg-gray-200">
            + 상품등록
          </Link>
        </div>
      </nav>

      {/* 카테고리 타이틀 */}
      <header className="bg-gray-50 py-12 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 uppercase tracking-widest">
          {categoryName} COLLECTION
        </h1>
        <p className="mt-2 text-gray-500">
          {loading ? "상품을 불러오는 중입니다..." : `총 ${products.length}개의 상품이 있습니다.`}
        </p>
      </header>

      {/* 상품 그리드 리스트 */}
      <main className="container mx-auto px-6 py-12">
        {loading ? (
           <div className="text-center py-20">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            등록된 상품이 없습니다. 관리자 페이지에서 상품을 등록해보세요!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                {/* 상품 이미지 카드 */}
                <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-200 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.imageUrl} // DB의 이미지 주소 사용
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* 품절/카테고리 표시 등 자유롭게 추가 가능 */}
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {product.category.toUpperCase()}
                  </div>
                </div>

                {/* 상품 정보 */}
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      <Link href={`/products/detail/${product.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 uppercase">{product.category}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    ₩{Number(product.price).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}