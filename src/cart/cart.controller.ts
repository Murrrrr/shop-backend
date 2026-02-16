import {
  Controller, Get, Post, Patch, Delete,
  Body, Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';

@ApiTags('장바구니')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: '장바구니 조회' })
  getCart() {
    return this.cartService.getCart();
  }

  @Post('items')
  @ApiOperation({ summary: '장바구니에 상품 추가' })
  addItem(@Body() dto: AddCartItemDto) {
    return this.cartService.addItem(dto.productId, dto.quantity);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: '장바구니 아이템 수량 변경' })
  updateItem(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateItem(id, quantity);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: '장바구니 아이템 삭제' })
  removeItem(@Param('id') id: string) {
    return this.cartService.removeItem(id);
  }

  @Delete()
  @ApiOperation({ summary: '장바구니 비우기' })
  clearCart() {
    this.cartService.clear();
    return { message: '장바구니가 비워졌습니다' };
  }
}
