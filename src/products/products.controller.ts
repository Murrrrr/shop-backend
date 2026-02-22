import { Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiParam, ApiQuery,
  ApiBody, ApiOkResponse, ApiCreatedResponse,
  ApiNotFoundResponse, ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  @ApiOperation({ summary: '상품 목록 조회', description: '카테고리별 필터링과 페이지네이션을 지원합니다' })
  @ApiQuery({ name: 'category', type: 'string', required: false, description: '카테고리 필터' })
  @ApiQuery({ name: 'page', type: 'number', required: false, description: '페이지 번호', example: '1' })
  @ApiQuery({ name: 'limit', type: 'number', required: false, description: '페이지당 항목 수', example: '20' })
  @ApiOkResponse({ description: '상품 목록 반환', type: 'Product[]' })
  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {}

  @ApiOperation({ summary: '상품 상세 조회', description: '상품 ID로 단일 상품 정보를 조회합니다' })
  @ApiParam({ name: 'id', type: 'string', required: true, description: '상품 ID' })
  @ApiOkResponse({ description: '상품 상세 정보', type: 'Product' })
  @ApiNotFoundResponse({ description: '상품을 찾을 수 없음' })
  @Get(':id')
  findOne(@Param('id') id: string) {}

  @ApiOperation({ summary: '상품 생성', description: '새 상품을 등록합니다. 인증 필요' })
  @ApiBearerAuth()
  @ApiBody({ description: '상품 생성 정보', type: 'CreateProductDto' })
  @ApiCreatedResponse({ description: '상품이 생성됨', type: 'Product' })
  @Post()
  create(@Body() dto: CreateProductDto) {}

  @ApiOperation({ summary: '상품 삭제', description: '상품 ID로 삭제합니다. 인증 필요' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', required: true, description: '삭제할 상품 ID' })
  @ApiOkResponse({ description: '삭제 완료' })
  @ApiNotFoundResponse({ description: '상품을 찾을 수 없음' })
  @Delete(':id')
  remove(@Param('id') id: string) {}
}
