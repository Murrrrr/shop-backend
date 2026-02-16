import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

// 상품 수정 DTO (모든 필드 선택적)
export class UpdateProductDto extends PartialType(CreateProductDto) {}
