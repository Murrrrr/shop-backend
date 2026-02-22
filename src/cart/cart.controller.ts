import {
  Controller, Get, Post, Patch, Delete,
  Body, Param,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiParam, ApiBody,
  ApiOkResponse, ApiCreatedResponse, ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';

@ApiTags('장바구니')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: '장바구니 조회', description: '현재 사용자의 장바구니 전체 내용을 조회합니다' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: '장바구니 내용', type: 'Cart' })
  getCart() {
    return this.cartService.getCart();
  }

  @Post('items')
  @ApiOperation({ summary: '장바구니에 상품 추가', description: '상품 ID와 수량을 지정하여 장바구니에 추가합니다' })
  @ApiBearerAuth()
  @ApiBody({ description: '추가할 상품 정보', type: 'AddCartItemDto' })
  @ApiCreatedResponse({ description: '장바구니에 추가됨', type: 'CartItem' })
  addItem(@Body() dto: AddCartItemDto) {
    return this.cartService.addItem(dto.productId, dto.quantity);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: '장바구니 아이템 수량 변경', description: '장바구니 아이템의 수량을 변경합니다' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', required: true, description: '장바구니 아이템 ID' })
  @ApiBody({ description: '변경할 수량', type: 'number' })
  @ApiOkResponse({ description: '수량 변경 완료', type: 'CartItem' })
  @ApiNotFoundResponse({ description: '아이템을 찾을 수 없음' })
  updateItem(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateItem(id, quantity);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: '장바구니 아이템 삭제', description: '장바구니에서 특정 아이템을 제거합니다' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', required: true, description: '삭제할 아이템 ID' })
  @ApiOkResponse({ description: '삭제 완료' })
  @ApiNotFoundResponse({ description: '아이템을 찾을 수 없음' })
  removeItem(@Param('id') id: string) {
    return this.cartService.removeItem(id);
  }

  @Delete()
  @ApiOperation({ summary: '장바구니 비우기', description: '장바구니의 모든 아이템을 삭제합니다' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: '장바구니가 비워짐' })
  clearCart() {
    this.cartService.clear();
    return { message: '장바구니가 비워졌습니다' };
  }
}
