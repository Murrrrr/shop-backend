import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CartService } from '../cart/cart.service';

// 주문 인터페이스
export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  status: '주문접수' | '결제완료' | '배송준비' | '배송중' | '배송완료';
  createdAt: Date;
}

@Injectable()
export class OrdersService {
  // 인메모리 주문 저장소
  private orders: Order[] = [];
  private nextId = 1;

  constructor(private readonly cartService: CartService) {}

  // 전체 주문 조회
  findAll(): Order[] {
    return this.orders.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  // 단일 주문 조회
  findOne(id: string): Order {
    const order = this.orders.find((o) => o.id === id);
    if (!order) throw new NotFoundException('주문을 찾을 수 없습니다');
    return order;
  }

  // 주문 생성 (장바구니 기반)
  create(shippingAddress: string): Order {
    const cart = this.cartService.getCart();
    if (cart.items.length === 0) {
      throw new BadRequestException('장바구니가 비어있습니다');
    }

    const order: Order = {
      id: String(this.nextId++),
      items: cart.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount: cart.total,
      shippingAddress,
      status: '주문접수',
      createdAt: new Date(),
    };

    this.orders.push(order);
    this.cartService.clear(); // 주문 후 장바구니 비우기
    return order;
  }
}
