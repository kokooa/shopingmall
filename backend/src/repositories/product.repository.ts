import { PrismaClient } from '@prisma/client';

export class ProductRepository {
  private prisma = new PrismaClient();

  // 상품 생성
  async createProduct(data: any) {
    return await this.prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        description: data.description,
        category: data.category,
        imageUrl: data.imageUrl, // 이미지 경로 저장
      },
    });
  }

  // 전체/카테고리별 조회
  async findAll(category?: string) {
    const whereCondition = (category && category !== 'all') 
      ? { category: String(category) } 
      : {};

    return await this.prisma.product.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
    });
  }

  // 상세 조회
  async findById(id: number) {
    return await this.prisma.product.findUnique({
      where: { id },
    });
  }
}