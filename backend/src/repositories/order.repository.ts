import prisma from '../common/prisma';
import { Prisma } from '@prisma/client';

export class OrderRepository {
  private prisma = prisma;

  // 주문 생성 트랜잭션 (가장 중요!)
  async createOrderTransaction(
    userId: number,
    merchantUid: string,
    impUid: string,
    totalAmount: number,
    items: any[] // 장바구니 아이템들
  ) {
    return await this.prisma.$transaction(async (tx) => {
      
      // 1. 주문(Order) 기록 생성
      const order = await tx.order.create({
        data: {
          userId,
          merchantUid, // 주문번호
          impUid,      // 결제번호 (포트원)
          totalAmount,
          status: 'PAID', // 결제 완료 상태로 시작
        },
      });

      // 2. 주문 상세(OrderItem) 기록 생성
      for (const item of items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price, // 구매 당시 가격 박제
          },
        });
      }

      // 3. 장바구니 비우기 (구매했으니 삭제)
      // 해당 유저의 장바구니 아이템 전체 삭제
      const cart = await tx.cart.findUnique({ where: { userId } });
      if (cart) {
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
      }

      return order;
    });
  }

  // 내 주문 목록 조회 (최신순)
  async findOrdersByUserId(userId: number) {
    return await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }, // 최신 주문이 위로
      include: {
        orderItems: {
          include: {
            product: true // 무슨 상품 샀는지 정보 포함
          }
        }
      }
    });
  }
}