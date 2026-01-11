"use client";

import React, { useState } from 'react';
import api from '@/api/axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function NewProductPage() {
  const router = useRouter();
  
  // 입력 폼 상태
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: 'TOP',
    description: '',
  });
  
  // 파일 상태
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // 미리보기용 URL
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("이미지를 등록해주세요!");

    try {
      // 1. FormData 객체 생성 (이미지 전송 필수)
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('category', form.category);
      formData.append('description', form.description);
      formData.append('image', file); // 'image'라는 이름 중요 (백엔드 upload.single('image')와 일치)

      // 2. 백엔드 전송 (Content-Type은 axios가 자동 설정)
      await api.post('/api/admin/products', formData);
      
      alert("상품이 성공적으로 등록되었습니다!");
      router.push('/admin'); // 대시보드로 이동
    } catch (error) {
      console.error(error);
      alert("상품 등록에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-8 text-gray-800 border-b pb-4">상품 등록</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. 이미지 업로드 */}
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">상품 이미지</label>
            <div className="flex items-start gap-4">
              <div className="w-40 h-52 bg-gray-100 border border-gray-300 rounded flex items-center justify-center overflow-hidden relative">
                {preview ? (
                  <Image src={preview} alt="Preview" fill className="object-cover" />
                ) : (
                  <span className="text-gray-400 text-xs">이미지 없음</span>
                )}
              </div>
              <div className="flex-1">
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-2">* 5MB 이하의 jpg, png, webp 파일만 가능합니다.</p>
              </div>
            </div>
          </div>

          {/* 2. 상품명 */}
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">상품명</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-black" 
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              placeholder="예: 오버핏 코튼 티셔츠"
              required
            />
          </div>

          {/* 3. 가격 & 카테고리 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">가격</label>
                <div className="relative">
                    <input 
                    type="number" 
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-black" 
                    value={form.price}
                    onChange={e => setForm({...form, price: e.target.value})}
                    placeholder="0"
                    required
                    />
                    <span className="absolute right-4 top-3 text-gray-400">원</span>
                </div>
            </div>
            <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">카테고리</label>
                <select 
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-black bg-white"
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}
                >
                <option value="TOP">TOP</option>
                <option value="BOTTOM">BOTTOM</option>
                <option value="OUTER">OUTER</option>
                <option value="ACC">ACC</option>
                </select>
            </div>
          </div>

          {/* 4. 설명 */}
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">상세 설명</label>
            <textarea 
              className="w-full border border-gray-300 p-3 rounded h-32 focus:outline-none focus:border-black resize-none" 
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              placeholder="상품에 대한 상세한 설명을 입력해주세요."
            />
          </div>

          {/* 등록 버튼 */}
          <button 
            type="submit" 
            className="w-full bg-black text-white font-bold py-4 rounded hover:bg-gray-800 transition shadow-lg mt-4"
          >
            상품 등록 완료
          </button>
        </form>
      </div>
    </div>
  );
}