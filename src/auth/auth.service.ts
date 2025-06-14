import { Injectable } from '@nestjs/common';
import { SignUpDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  signup(signUpDto: SignUpDto) {
    return `Signing up user with email: ${signUpDto.email}`;
  }

  login(loginDto: LoginDto) {
    return `Logging in user with email: ${loginDto.email}`;
  }
}
