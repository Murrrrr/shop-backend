import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiParam, ApiQuery, ApiHeader,
  ApiBody, ApiOkResponse, ApiCreatedResponse,
  ApiNotFoundResponse, ApiBearerAuth, ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  @ApiOperation({ summary: '상품 목록 조회 (v2)', description: '카테고리, 가격 범위, 검색어 필터링과 정렬을 지원합니다' })
  @ApiQuery({ name: 'category', type: 'string', required: false, description: '카테고리 필터' })
  @ApiQuery({ name: 'search', type: 'string', required: false, description: '상품명 검색어' })
  @ApiQuery({ name: 'minPrice', type: 'number', required: false, description: '최소 가격', example: '0' })
  @ApiQuery({ name: 'maxPrice', type: 'number', required: false, description: '최대 가격', example: '100000' })
  @ApiQuery({ name: 'sort', type: 'string', required: false, description: '정렬 기준 (price_asc, price_desc, newest, popular)' })
  @ApiQuery({ name: 'page', type: 'number', required: false, description: '페이지 번호', example: '1' })
  @ApiQuery({ name: 'limit', type: 'number', required: false, description: '페이지당 항목 수', example: '20' })
  @ApiOkResponse({ description: '상품 목록 (페이지네이션 포함)', type: 'PaginatedProducts' })
  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('sort') sort?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {}

  @ApiOperation({ summary: '인기 상품 조회', description: '판매량 기준 인기 상품 TOP N을 조회합니다' })
  @ApiQuery({ name: 'limit', type: 'number', required: false, description: '조회할 상품 수 (기본 10)', example: '10' })
  @ApiOkResponse({ description: '인기 상품 목록', type: 'Product[]' })
  @Get('popular')
  findPopular(@Query('limit') limit?: number) {}

  @ApiOperation({ summary: '상품 상세 조회', description: '상품 ID로 단일 상품 정보와 리뷰를 조회합니다' })
  @ApiParam({ name: 'id', type: 'string', required: true, description: '상품 ID' })
  @ApiOkResponse({ description: '상품 상세 정보 (리뷰 포함)', type: 'ProductDetail' })
  @ApiNotFoundResponse({ description: '상품을 찾을 수 없음' })
  @Get(':id')
  findOne(@Param('id') id: string) {}

  @ApiOperation({ summary: '상품 생성', description: '새 상품을 등록합니다. 관리자 인증 필요' })
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-admin-key', type: 'string', required: true, description: '관리자 API 키' })
  @ApiBody({ description: '상품 생성 정보', type: 'CreateProductDto' })
  @ApiCreatedResponse({ description: '상품이 생성됨', type: 'Product' })
  @ApiBadRequestResponse({ description: '유효성 검증 실패' })
  @Post()
  create(@Body() dto: CreateProductDto) {}

  @ApiOperation({ summary: '상품 수정', description: '상품 정보를 업데이트합니다. 관리자 인증 필요' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', required: true, description: '수정할 상품 ID' })
  @ApiBody({ description: '수정할 상품 정보', type: 'UpdateProductDto' })
  @ApiOkResponse({ description: '수정 완료', type: 'Product' })
  @ApiNotFoundResponse({ description: '상품을 찾을 수 없음' })
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {}

  @ApiOperation({ summary: '상품 삭제', description: '상품 ID로 삭제합니다. 관리자 인증 필요' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', required: true, description: '삭제할 상품 ID' })
  @ApiOkResponse({ description: '삭제 완료' })
  @ApiNotFoundResponse({ description: '상품을 찾을 수 없음' })
  @Delete(':id')
  remove(@Param('id') id: string) {}
}
