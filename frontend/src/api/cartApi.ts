import api from './axios';

// 1. 내 장바구니 목록 가져오기
export const getCartItems = async () => {
  // axios.ts에서 baseURL에 '/api'를 이미 붙였다면, 여기선 '/cart'만 써야 합니다!
  // 만약 404가 뜬다면 '/cart'로 바꿔보세요.
  const response = await api.get('/api/cart'); 
  return response.data; 
};

// 2. 장바구니 담기 (🚨 수정됨!)
// 상품을 담는 것이므로 itemId가 아니라 productId여야 합니다.
export const addToCart = async (productId: number, quantity: number) => {
  // 백엔드 컨트롤러도 req.body.productId를 기다리고 있을 겁니다.
  const response = await api.post('/api/cart', { productId, quantity });
  return response.data;
};

// 3. 수량 변경 (✅ 이건 itemId가 맞음)
// 이미 장바구니에 담긴 특정 줄(CartItem)을 수정하는 것이기 때문입니다.
export const updateCartItem = async (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    const response = await api.patch(`/api/cart/${itemId}`, { quantity });
    return response.data;
};

// 4. 삭제 (✅ 이것도 itemId가 맞음)
// 장바구니의 특정 줄(CartItem)을 지우는 것이기 때문입니다.
export const removeCartItem = async (itemId: number) => {
  const response = await api.delete(`api//cart/${itemId}`);
  return response.data;
};