import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

// 상품 인터페이스
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  createdAt: Date;
}

@Injectable()
export class ProductsService {
  // 인메모리 상품 저장소 (샘플 데이터 포함)
  private products: Product[] = [
    {
      id: '1',
      name: '무선 블루투스 이어폰',
      description: '고음질 블루투스 5.3 무선 이어폰, 노이즈 캔슬링 지원',
      price: 49900,
      category: '전자기기',
      imageUrl: 'https://picsum.photos/seed/earphone/400/400',
      stock: 150,
      createdAt: new Date(),
    },
    {
      id: '2',
      name: '스마트 워치 프로',
      description: '심박수, 산소포화도 측정 가능한 프리미엄 스마트워치',
      price: 299000,
      category: '전자기기',
      imageUrl: 'https://picsum.photos/seed/watch/400/400',
      stock: 50,
      createdAt: new Date(),
    },
    {
      id: '3',
      name: '오가닉 코튼 티셔츠',
      description: '100% 유기농 면으로 만든 편안한 기본 티셔츠',
      price: 29000,
      category: '의류',
      imageUrl: 'https://picsum.photos/seed/tshirt/400/400',
      stock: 300,
      createdAt: new Date(),
    },
    {
      id: '4',
      name: '프리미엄 원두 커피',
      description: '에티오피아 예가체프 싱글 오리진 원두 500g',
      price: 18500,
      category: '식품',
      imageUrl: 'https://picsum.photos/seed/coffee/400/400',
      stock: 200,
      createdAt: new Date(),
    },
    {
      id: '5',
      name: '가죽 크로스백',
      description: '이탈리안 천연 소가죽 미니 크로스백',
      price: 89000,
      category: '패션잡화',
      imageUrl: 'https://picsum.photos/seed/bag/400/400',
      stock: 80,
      createdAt: new Date(),
    },
  ];

  private nextId = 6;

  // 전체 상품 조회 (카테고리, 검색어, 페이지네이션, 정렬 지원)
  findAll(
    category?: string,
    search?: string,
    page?: string,
    limit?: string,
    sort?: string,
  ) {
    let result = this.products;

    // 카테고리 필터
    if (category) {
      result = result.filter((p) => p.category === category);
    }
    // 검색어 필터
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      );
    }
    // 정렬
    if (sort === 'price_asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      result = [...result].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    // 페이지네이션
    const pageNum = Math.max(1, parseInt(page || '1', 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit || '20', 10) || 20));
    const total = result.length;
    const items = result.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    return {
      items,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  // 단일 상품 조회
  findOne(id: string): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) throw new NotFoundException('상품을 찾을 수 없습니다');
    return product;
  }

  // 단일 상품 + 관련 상품 조회
  findOneWithRelated(id: string) {
    const product = this.findOne(id);
    const related = this.products
      .filter((p) => p.id !== id && p.category === product.category)
      .slice(0, 4);
    return { ...product, relatedProducts: related };
  }

  // 상품 생성
  create(dto: CreateProductDto): Product {
    const product: Product = {
      id: String(this.nextId++),
      ...dto,
      imageUrl: dto.imageUrl || '',
      createdAt: new Date(),
    };
    this.products.push(product);
    return product;
  }

  // 상품 수정
  update(id: string, dto: UpdateProductDto): Product {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) throw new NotFoundException('상품을 찾을 수 없습니다');
    this.products[index] = { ...this.products[index], ...dto };
    return this.products[index];
  }

  // 상품 삭제
  remove(id: string): void {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) throw new NotFoundException('상품을 찾을 수 없습니다');
    this.products.splice(index, 1);
  }
}
