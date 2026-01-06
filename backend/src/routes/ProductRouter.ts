import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// 1. 상품 등록 (POST /api/products)
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, price, category, imageUrl, description } = req.body;
        
        const newProduct = await prisma.product.create({
            data: {
                name,
                price: Number(price), // 숫자로 변환
                category,
                imageUrl,
                description
            }
        });
        
        return res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "상품 등록 실패" });
    }
});

// 2. 카테고리별 상품 조회 (GET /api/products?category=outer)
router.get('/', async (req: Request, res: Response) => {
    try {
        const { category } = req.query;
        
        // category가 'all'이거나 없으면 전체 조회, 아니면 필터링
        const whereCondition = (category && category !== 'all') 
            ? { category: String(category) } 
            : {};

        const products = await prisma.product.findMany({
            where: whereCondition,
            orderBy: { createdAt: 'desc' } // 최신순 정렬
        });
        
        return res.json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "상품 조회 실패" });
    }
});

// 3. 상품 상세 조회 (GET /api/products/:id)
// 주의: 이 코드는 router.get('/', ...) 보다 아래에 두는 게 안전합니다.
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id: Number(id) } // id는 숫자여야 함
        });

        if (!product) {
            return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
        }

        return res.json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "서버 에러" });
    }
});

export default router;