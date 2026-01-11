import { Request, Response } from 'express';
import { CartRepository } from '../repositories/cart.repository';

const cartRepository = new CartRepository();

// 1. 장바구니 담기 (가장 중요!)
export const addToCart = async (req: Request, res: Response) => {
  try {
    // verifyToken 미들웨어가 req.user에 유저 정보를 넣어줬다고 가정
    const userId = (req as any).user?.id; 
    const { productId, quantity } = req.body;

    if (!userId) return res.status(401).json({ message: '유저 인증 실패' });
    if (!productId || !quantity) return res.status(400).json({ message: '필수 값이 누락되었습니다.' });

    // [STEP 1] 이 유저의 장바구니가 이미 있는지 확인
    let cart = await cartRepository.findCartByUserId(userId);

    // [STEP 2] 장바구니가 없으면 -> 새로 만든다! (⭐⭐⭐ 여기가 핵심)
    if (!cart) {
      cart = await cartRepository.createCart(userId);
    }

    // [STEP 3] 이미 담겨있는 상품인지 확인 (중복 체크)
    const existingItem = await cartRepository.findCartItem(cart.id, productId);

    if (existingItem) {
      // 이미 있으면 -> 수량만 더하기
      await cartRepository.updateCartItemQuantity(
        existingItem.id, 
        existingItem.quantity + quantity
      );
    } else {
      // 없으면 -> 새로 만들기 (이때 userId가 아니라 cart.id를 넣어야 함!)
      await cartRepository.createCartItem(cart.id, productId, quantity);
    }

    return res.status(200).json({ message: '장바구니에 담겼습니다.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '장바구니 담기 실패', error });
  }
};

// 2. 내 장바구니 조회
export const getMyCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    
    // 장바구니 조회
    const cart = await cartRepository.findCartByUserId(userId);

    // 장바구니가 아예 없으면 빈 배열 반환
    if (!cart) {
      return res.status(200).json({ list: [] });
    }

    // 프론트엔드가 { list: [...] } 형태를 기대하므로 맞춰줌
    return res.status(200).json({ list: cart.items });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '장바구니 조회 실패' });
  }
};

// 3. 수량 변경
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const itemId = Number(req.params.itemId); // URL의 :itemId
    const { quantity } = req.body;

    await cartRepository.updateCartItemQuantity(itemId, quantity);
    return res.status(200).json({ message: '수량 변경 완료' });
  } catch (error) {
    return res.status(500).json({ message: '수량 변경 실패' });
  }
};

// 4. 아이템 삭제
export const deleteCartItem = async (req: Request, res: Response) => {
  try {
    const itemId = Number(req.params.itemId);
    await cartRepository.deleteCartItem(itemId);
    return res.status(200).json({ message: '삭제 완료' });
  } catch (error) {
    return res.status(500).json({ message: '삭제 실패' });
  }
};