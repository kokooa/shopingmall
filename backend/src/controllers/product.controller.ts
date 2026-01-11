import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { uploadImageToSupabase } from '../utils/supabase';

const productService = new ProductService();

// 상품 등록
export const createProduct = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    
    if (!file) {
      throw new Error("이미지 파일은 필수입니다.");
    }

    // ✅ [핵심] 로컬 경로 대신 Supabase에 올리고 URL 받아오기
    const uploadedImageUrl = await uploadImageToSupabase(file); 

    const product = await productService.createProduct(req.body, uploadedImageUrl);
    
    return res.status(201).json(product);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "상품 등록 실패" });
  }
};

// 목록 조회
export const getProducts = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;
    const products = await productService.getProducts(category);
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "조회 실패" });
  }
};

// 상세 조회
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    return res.status(200).json(product);
  } catch (error: any) {
    const status = error.message === "상품을 찾을 수 없습니다." ? 404 : 500;
    return res.status(status).json({ message: error.message });
  }
};