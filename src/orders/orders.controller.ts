import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody,
  ApiOkResponse, ApiCreatedResponse, ApiNotFoundResponse,
  ApiBearerAuth, ApiBadRequestResponse,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('주문')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: '내 주문 목록 조회', description: '인증된 사용자의 주문 이력을 상태별로 필터링하여 조회합니다' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'status', type: 'string', required: false, description: '주문 상태 필터 (pending, confirmed, shipped, delivered, cancelled)' })
  @ApiQuery({ name: 'page', type: 'number', required: false, description: '페이지 번호' })
  @ApiOkResponse({ description: '주문 목록', type: 'PaginatedOrders' })
  findAll(
    @Query('status') status?: string,
    @Query('page') page?: number,
  ) {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '주문 상세 조회', description: '주문 ID로 상세 정보, 배송 추적, 결제 내역을 조회합니다' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', required: true, description: '주문 ID' })
  @ApiOkResponse({ description: '주문 상세 (배송 추적 포함)', type: 'OrderDetail' })
  @ApiNotFoundResponse({ description: '주문을 찾을 수 없음' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '주문 생성', description: '현재 장바구니 내용으로 주문을 생성합니다' })
  @ApiBearerAuth()
  @ApiBody({ description: '배송지 및 결제 정보', type: 'CreateOrderDto' })
  @ApiCreatedResponse({ description: '주문이 생성됨', type: 'Order' })
  @ApiBadRequestResponse({ description: '장바구니가 비어있거나 재고 부족' })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto.shippingAddress);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: '주문 취소', description: '배송 전 주문을 취소합니다' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', required: true, description: '취소할 주문 ID' })
  @ApiOkResponse({ description: '주문 취소 완료', type: 'Order' })
  @ApiNotFoundResponse({ description: '주문을 찾을 수 없음' })
  @ApiBadRequestResponse({ description: '이미 배송 중이거나 완료된 주문' })
  cancel(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
