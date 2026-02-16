import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// 상품 생성 DTO
export class CreateProductDto {
  @ApiProperty({ example: '무선 블루투스 이어폰' })
  @IsString()
  name: string;

  @ApiProperty({ example: '고음질 블루투스 5.3 이어폰' })
  @IsString()
  description: string;

  @ApiProperty({ example: 49900 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: '전자기기' })
  @IsString()
  category: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  stock: number;
}
