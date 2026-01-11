import { CartRepository } from '../repositories/cart.repository';

export class CartService {
  private cartRepository = new CartRepository();

  // 장바구니 담기 (핵심 로직)
  async addToCart(userId: number, productId: number, quantity: number) {
    const qty = quantity || 1;

    // 1. 유저 장바구니 확인
    let cart = await this.cartRepository.findCartByUserId(userId);

    // 2. 없으면 생성
    if (!cart) {
      cart = await this.cartRepository.createCart(userId);
    }

    // 3. 이미 담긴 상품인지 확인
    const existingItem = await this.cartRepository.findCartItem(cart.id, productId);

    if (existingItem) {
      // 4-A. 이미 있으면 수량 합산 (기존 수량 + 새 수량)
      return await this.cartRepository.updateCartItemQuantity(
        existingItem.id, 
        existingItem.quantity + qty
      );
    } else {
      // 4-B. 없으면 새로 추가
      return await this.cartRepository.createCartItem(cart.id, productId, qty);
    }
  }

  // 내 장바구니 조회
  async getMyCart(userId: number) {
    const cart = await this.cartRepository.findCartByUserId(userId);
    // 장바구니가 없으면 빈 배열 반환 (에러 아님)
    if (!cart) {
      return { items: [] };
    }
    return cart;
  }

  // 수량 변경 (PATCH)
  async updateItemQuantity(itemId: number, quantity: number) {
    if (quantity < 1) {
      throw new Error("수량은 1개 이상이어야 합니다.");
    }
    return await this.cartRepository.updateCartItemQuantity(itemId, quantity);
  }

  // 아이템 삭제
  async removeCartItem(itemId: number) {
    return await this.cartRepository.deleteCartItem(itemId);
  }
}