import api from './axios';

export const createProduct = async (formData: FormData) => {
  const response = await api.post('/api/products', formData, {
    // headers: {
    //   'Content-Type': 'multipart/form-data',
    // },
  });
  return response.data;
};

// 전체 상품 목록 가져오기
export const getProducts = async () => {
  const response = await api.get('/api/products');
  return response.data; // { list: [...], totalCount: ... } 형태일 것임
};