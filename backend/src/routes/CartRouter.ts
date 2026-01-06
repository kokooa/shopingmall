import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// 1. 장바구니 담기 (POST /api/cart)
// 로직: 유저 장바구니 확인 -> 없으면 생성 -> 상품 확인 -> 있으면 수량+, 없으면 추가
// ==========================================
router.post('/', async (req: Request, res: Response) => {
    try {
        const { userId, productId, quantity } = req.body;
        const qty = quantity || 1; // 수량 안 보내면 기본 1개

        // 1. 유저의 장바구니가 있는지 확인
        let cart = await prisma.cart.findUnique({
            where: { userId: Number(userId) }
        });

        // 2. 장바구니가 없으면 새로 생성 (First Time User)
        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: Number(userId) }
            });
        }

        // 3. 이미 장바구니에 담겨있는 상품인지 확인
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: Number(productId)
            }
        });

        if (existingItem) {
            // 4-A. 이미 있으면: 수량만 증가 (Update)
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + qty }
            });
            return res.json({ message: "상품 수량이 증가했습니다." });
        } else {
            // 4-B. 없으면: 새로 추가 (Create)
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: Number(productId),
                    quantity: qty
                }
            });
            return res.json({ message: "장바구니에 담겼습니다." });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "장바구니 담기 실패" });
    }
});

// ==========================================
// 2. 내 장바구니 조회 (GET /api/cart/:userId)
// 핵심: 장바구니(Cart) -> 아이템(Items) -> 상품정보(Product)까지 한 번에 가져오기
// ==========================================
router.get('/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const cart = await prisma.cart.findUnique({
            where: { userId: Number(userId) },
            include: {
                items: {
                    orderBy: { createdAt: 'desc' }, // 최신순 정렬
                    include: {
                        product: true // ⭐ 상품 정보(이름, 가격, 이미지)까지 같이 가져옴
                    }
                }
            }
        });

        if (!cart) {
            return res.json({ items: [] }); // 장바구니 없으면 빈 배열 반환
        }

        return res.json(cart);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "장바구니 조회 실패" });
    }
});

// ==========================================
// 3. 아이템 삭제 (DELETE /api/cart/:itemId)
// ==========================================
router.delete('/:itemId', async (req: Request, res: Response) => {
    try {
        const { itemId } = req.params;

        await prisma.cartItem.delete({
            where: { id: Number(itemId) }
        });

        return res.json({ message: "삭제되었습니다." });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "삭제 실패" });
    }
});


// ==========================================
// 4. 수량 변경 (PATCH /api/cart/:itemId) 
// ==========================================
router.patch('/:itemId', async (req: Request, res: Response) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
             return res.status(400).json({ message: "수량은 1개 이상이어야 합니다." });
        }

        const updatedItem = await prisma.cartItem.update({
            where: { id: Number(itemId) },
            data: { quantity: Number(quantity) }
        });

        return res.json(updatedItem);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "수량 변경 실패" });
    }
});

export default router;