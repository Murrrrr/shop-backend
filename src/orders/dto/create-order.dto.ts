import { IsString, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// 주문 생성 DTO
export class CreateOrderDto {
  @ApiProperty({ example: '서울시 강남구 테헤란로 123' })
  @IsString()
  shippingAddress: string;
}
