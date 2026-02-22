import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiParam, ApiBody,
  ApiOkResponse, ApiCreatedResponse, ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('주문')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: '전체 주문 목록 조회', description: '인증된 사용자의 전체 주문 이력을 조회합니다' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: '주문 목록', type: 'Order[]' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '주문 상세 조회', description: '주문 ID로 상세 정보와 배송 상태를 조회합니다' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', required: true, description: '주문 ID' })
  @ApiOkResponse({ description: '주문 상세 (배송 상태 포함)', type: 'Order' })
  @ApiNotFoundResponse({ description: '주문을 찾을 수 없음' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '주문 생성', description: '현재 장바구니 내용으로 주문을 생성합니다' })
  @ApiBearerAuth()
  @ApiBody({ description: '배송지 정보', type: 'CreateOrderDto' })
  @ApiCreatedResponse({ description: '주문이 생성됨', type: 'Order' })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto.shippingAddress);
  }
}
