import { ProductRepository } from '../repositories/product.repository';

export class ProductService {
  private productRepository = new ProductRepository();

  async createProduct(body: any, imageUrl: string) {

    // 2. 데이터 가공
    const productData = {
      ...body,
      price: Number(body.price), // 문자열 -> 숫자 변환
      imageUrl: imageUrl, // 파일 경로 생성
    };

    // 3. Repository 호출
    return await this.productRepository.createProduct(productData);
  }

  async getProducts(category?: string) {
    return await this.productRepository.findAll(category);
  }

  async getProductById(id: string) {
    const productId = Number(id);
    if (isNaN(productId)) {
      throw new Error("유효하지 않은 상품 ID입니다.");
    }

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error("상품을 찾을 수 없습니다.");
    }
    return product;
  }
}