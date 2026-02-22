import { Controller, Post, Get, Body } from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiBody,
  ApiOkResponse, ApiCreatedResponse, ApiUnauthorizedResponse,
  ApiBearerAuth, ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '이메일/비밀번호 로그인', description: '이메일과 비밀번호로 로그인하여 JWT 토큰을 발급받습니다' })
  @ApiBody({ description: '로그인 정보', type: 'LoginDto' })
  @ApiOkResponse({ description: 'JWT 토큰 반환', type: 'TokenResponse' })
  @ApiUnauthorizedResponse({ description: '잘못된 이메일 또는 비밀번호' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('register')
  @ApiOperation({ summary: '회원가입', description: '새 사용자를 등록합니다' })
  @ApiBody({ description: '회원가입 정보', type: 'RegisterDto' })
  @ApiCreatedResponse({ description: '회원가입 완료', type: 'User' })
  @ApiBadRequestResponse({ description: '유효성 검증 실패 또는 이메일 중복' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.name, dto.email, dto.password);
  }

  @Get('profile')
  @ApiOperation({ summary: '프로필 조회', description: 'JWT 토큰으로 인증된 사용자의 프로필을 조회합니다' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: '사용자 프로필', type: 'User' })
  @ApiUnauthorizedResponse({ description: '인증 토큰이 없거나 유효하지 않음' })
  getProfile() {
    return this.authService.getProfile('1');
  }
}
