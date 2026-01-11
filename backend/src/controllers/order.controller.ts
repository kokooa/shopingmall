import { Request, Response } from 'express';
import axios from 'axios';
import { OrderRepository } from '../repositories/order.repository';
import { CartRepository } from '../repositories/cart.repository';

const orderRepository = new OrderRepository();
const cartRepository = new CartRepository();

export const completeOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    // 프론트에서 보낸 결제 정보
    const { imp_uid, merchant_uid } = req.body; 

    // 1. 포트원 액세스 토큰 발급 받기
    const getTokenResponse = await axios.post('https://api.iamport.kr/users/getToken', {
      imp_key: process.env.PORTONE_API_KEY,
      imp_secret: process.env.PORTONE_API_SECRET
    });
    const { access_token } = getTokenResponse.data.response;

    // 2. 포트원 서버에 결제 정보 조회 (검증)
    const paymentDataResponse = await axios.get(`https://api.iamport.kr/payments/${imp_uid}`, {
      headers: { Authorization: access_token }
    });
    const paymentData = paymentDataResponse.data.response;

    // 3. 검증 로직: 결제 상태가 'paid'가 아니거나, 금액이 이상하면 에러
    if (paymentData.status !== 'paid') {
        return res.status(400).json({ message: '결제가 완료되지 않았습니다.' });
    }

    // 4. DB의 장바구니 금액과 실제 결제 금액 비교 (해킹 방지)
    const cart = await cartRepository.findCartByUserId(userId);
    if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: '장바구니가 비어있습니다.' });
    }

    // DB상 계산 금액
    const dbTotal = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const shippingCost = dbTotal > 50000 ? 0 : 3000;
    const finalAmount = dbTotal + shippingCost;

    // 금액 비교 (중요!)
    if (paymentData.amount !== finalAmount) {
        return res.status(400).json({ message: '결제 금액이 일치하지 않습니다. (위변조 의심)' });
    }

    // 5. 검증 통과! -> DB에 주문 저장 (트랜잭션)
    const order = await orderRepository.createOrderTransaction(
        userId,
        merchant_uid,
        imp_uid,
        finalAmount,
        cart.items
    );

    return res.status(200).json({ message: '주문이 완료되었습니다.', orderId: order.id });

  } catch (error) {
    console.error("주문 처리 실패:", error);
    return res.status(500).json({ message: '주문 처리에 실패했습니다.' });
  }
};

// 내 주문 내역 가져오기
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const orders = await orderRepository.findOrdersByUserId(userId);
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '주문 내역 조회 실패' });
  }
};