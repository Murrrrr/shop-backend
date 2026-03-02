import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiParam, ApiBody,
  ApiOkResponse, ApiCreatedResponse, ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  @ApiOperation({ summary: '모든 사용자 조회', description: '전체 사용자 목록을 반환합니다. 관리자 전용' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: '사용자 목록', type: 'User[]' })
  @Get()
  findAll() {}

  @ApiOperation({ summary: '사용자 상세 조회', description: '사용자 ID로 상세 정보를 조회합니다' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', required: true, description: '사용자 ID' })
  @ApiOkResponse({ description: '사용자 상세 정보', type: 'User' })
  @ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' })
  @Get(':id')
  findOne(@Param('id') id: string) {}

  @ApiOperation({ summary: '사용자 생성', description: '관리자가 직접 사용자를 생성합니다' })
  @ApiBearerAuth()
  @ApiBody({ description: '사용자 생성 정보', type: 'CreateUserDto' })
  @ApiCreatedResponse({ description: '사용자 생성 완료', type: 'User' })
  @Post()
  create(@Body() body: any) {}

  @ApiOperation({ summary: '사용자 수정', description: '사용자 정보를 업데이트합니다' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', required: true, description: '수정할 사용자 ID' })
  @ApiBody({ description: '수정할 사용자 정보', type: 'UpdateUserDto' })
  @ApiOkResponse({ description: '수정 완료', type: 'User' })
  @ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' })
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {}

  @ApiOperation({ summary: '사용자 삭제', description: '사용자를 삭제합니다. 관리자 전용' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', required: true, description: '삭제할 사용자 ID' })
  @ApiOkResponse({ description: '삭제 완료' })
  @ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' })
  @Delete(':id')
  remove(@Param('id') id: string) {}

  @Post(':id/change-password')
  @ApiOperation({ summary: '비밀번호 변경', description: '현재 비밀번호 확인 후 새 비밀번호로 변경합니다' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', required: true, description: '사용자 ID' })
  @ApiBody({ description: '비밀번호 변경 정보', schema: { type: 'object', properties: { currentPassword: { type: 'string' }, newPassword: { type: 'string' } }, required: ['currentPassword', 'newPassword'] } })
  @ApiOkResponse({ description: '비밀번호 변경 완료' })
  @ApiBadRequestResponse({ description: '현재 비밀번호 불일치' })
  changePassword(@Param('id') id: string, @Body() body: { currentPassword: string; newPassword: string }) {}

  @Get(':id/orders')
  @ApiOperation({ summary: '사용자 주문 조회', description: '특정 사용자의 주문 내역을 조회합니다. 관리자 전용' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', required: true, description: '사용자 ID' })
  @ApiQuery({ name: 'status', type: 'string', required: false, description: '주문 상태 필터' })
  @ApiOkResponse({ description: '사용자의 주문 목록', type: 'Order[]' })
  @ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' })
  getUserOrders(@Param('id') id: string, @Query('status') status?: string) {}
}
