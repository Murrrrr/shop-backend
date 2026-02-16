import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('상품')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: '전체 상품 목록 조회 변경점 (필터, 페이지네이션, 정렬)' })
  @ApiQuery({ name: 'category', required: false, description: '카테고리 필터' })
  @ApiQuery({ name: 'search', required: false, description: '상품명 검색' })
  @ApiQuery({ name: 'minPrice', required: false, description: '최소 가격 필터' })
  @ApiQuery({ name: 'maxPrice', required: false, description: '최대 가격 필터' })
  @ApiQuery({ name: 'inStock', required: false, description: '재고 있는 상품만 (true/false)' })
  @ApiQuery({ name: 'page', required: false, description: '페이지 번호 (기본: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: '페이지 당 개수 (기본: 20)' })
  @ApiQuery({ name: 'sort', required: false, description: '정렬 기준 (price_asc, price_desc, newest, rating)' })
  findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('inStock') inStock?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
  ) {
    return this.productsService.findAll(
      category, search, minPrice, maxPrice, inStock, page, limit, sort,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: '상품 상세 조회 (관련 상품 포함)' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOneWithRelated(id);
  }

  @Post()
  @ApiOperation({ summary: '상품 등록' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '상품 수정' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '상품 삭제' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
