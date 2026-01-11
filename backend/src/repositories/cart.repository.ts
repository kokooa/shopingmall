import prisma from '../common/prisma';
import { PrismaClient } from '@prisma/client';

export class CartRepository {
  private prisma = prisma;

  // 유저 ID로 장바구니 찾기
  async findCartByUserId(userId: number) {
    return await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          orderBy: { createdAt: 'desc' },
          include: { product: true }, // 상품 정보 포함
        },
      },
    });
  }

  // 장바구니 생성
  async createCart(userId: number) {
    return await this.prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });
  }

  // 장바구니 아이템 찾기 (이미 담겨있는지 확인용)
  async findCartItem(cartId: number, productId: number) {
    return await this.prisma.cartItem.findFirst({
      where: { cartId, productId },
    });
  }

  // 장바구니 아이템 추가
  async createCartItem(cartId: number, productId: number, quantity: number) {
    return await this.prisma.cartItem.create({
      data: { cartId, productId, quantity },
    });
  }

  // 장바구니 아이템 수량 변경 (더하기 or 수정)
  async updateCartItemQuantity(itemId: number, quantity: number) {
    return await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  // 장바구니 아이템 삭제
  async deleteCartItem(itemId: number) {
    return await this.prisma.cartItem.delete({
      where: { id: itemId },
    });
  }
}