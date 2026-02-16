import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';

// 사용자 인터페이스
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  // 인메모리 사용자 저장소
  private users: User[] = [
    {
      id: '1',
      name: '테스트 사용자',
      email: 'test@example.com',
      password: 'password123',
    },
  ];
  private nextId = 2;

  // 로그인 (단순 비교, 실제로는 JWT 사용)
  login(email: string, password: string) {
    const user = this.users.find(
      (u) => u.email === email && u.password === password,
    );
    if (!user) throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다');

    return {
      token: `mock-jwt-token-${user.id}`,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  // 회원가입
  register(name: string, email: string, password: string) {
    const exists = this.users.find((u) => u.email === email);
    if (exists) throw new ConflictException('이미 가입된 이메일입니다');

    const user: User = { id: String(this.nextId++), name, email, password };
    this.users.push(user);

    return {
      token: `mock-jwt-token-${user.id}`,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  // 프로필 조회 (목업)
  getProfile(userId: string) {
    const user = this.users.find((u) => u.id === userId);
    if (!user) throw new UnauthorizedException('사용자를 찾을 수 없습니다');
    return { id: user.id, name: user.name, email: user.email };
  }
}
