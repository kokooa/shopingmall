import { Request, Response } from 'express';
import prisma from '../common/prisma'; // 싱글톤 prisma 가져오기
import { uploadImageToSupabase } from '../utils/supabase';

// 1. 모든 주문 내역 조회 (관리자용)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }, // 최신 주문이 위로 오게
      include: {
        user: {
          select: { email: true, name: true } // 누가 주문했는지 (이름, 이메일)
        },
        orderItems: {
          include: { product: true } // 무슨 상품인지
        }
      }
    });
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '주문 목록 조회 실패' });
  }
};

// 2. 주문 상태 변경 (예: 배송중, 배송완료)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body; // "SHIPPED", "DELIVERED" 등

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    return res.status(200).json({ message: '상태 변경 완료', order: updatedOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '상태 변경 실패' });
  }
};

// 3. 상품 등록 (Supabase 이미지 업로드 연동)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const file = req.file; 
    const { name, price, category, description } = req.body;

    if (!file) {
      return res.status(400).json({ message: '이미지가 필요합니다.' });
    }

    // 1. 유틸 함수를 써서 Supabase에 올리고 URL 받아오기
    // (이 함수가 알아서 파일명 만들고, 올리고, URL 리턴해줍니다)
    const imageUrl = await uploadImageToSupabase(file);

    // 2. DB에 상품 정보 저장 (이미지는 URL로 저장)
    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price), // 문자열 -> 숫자 변환
        category,
        description, // 스키마 필드명 확인 (detailInfo 인지 description 인지)
        imageUrl,    // 스키마 필드명 확인 (image 인지 imageUrl 인지)
      },
    });

    return res.status(201).json({ message: '상품 등록 성공', product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '상품 등록 실패' });
  }
};