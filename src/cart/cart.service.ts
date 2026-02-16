import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

// 장바구니 아이템 인터페이스
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

@Injectable()
export class CartService {
  // 인메모리 장바구니 (단일 사용자 가정)
  private items: CartItem[] = [];
  private nextId = 1;

  constructor(private readonly productsService: ProductsService) {}

  // 장바구니 조회
  getCart() {
    const total = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity, 0,
    );
    return { items: this.items, total, itemCount: this.items.length };
  }

  // 장바구니에 상품 추가
  addItem(productId: string, quantity: number): CartItem {
    const product = this.productsService.findOne(productId);

    // 이미 있는 상품이면 수량 증가
    const existing = this.items.find((i) => i.productId === productId);
    if (existing) {
      existing.quantity += quantity;
      return existing;
    }

    const item: CartItem = {
      id: String(this.nextId++),
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity,
    };
    this.items.push(item);
    return item;
  }

  // 장바구니 아이템 수량 변경
  updateItem(itemId: string, quantity: number): CartItem {
    const item = this.items.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('장바구니 아이템을 찾을 수 없습니다');
    item.quantity = quantity;
    return item;
  }

  // 장바구니 아이템 삭제
  removeItem(itemId: string): void {
    const index = this.items.findIndex((i) => i.id === itemId);
    if (index === -1) throw new NotFoundException('장바구니 아이템을 찾을 수 없습니다');
    this.items.splice(index, 1);
  }

  // 장바구니 비우기
  clear(): void {
    this.items = [];
  }
}
