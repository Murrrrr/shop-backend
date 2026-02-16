import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('주문')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: '전체 주문 목록 조회' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '주문 상세 조회 (배송 상태 포함)' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '주문 생성 (장바구니 기반)' })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto.shippingAddress);
  }
}
