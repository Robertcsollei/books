import { Injectable } from '@nestjs/common';
import { SignUpDto, LoginDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  signup(signUpDto: SignUpDto) {
    return `Signing up user with email: ${signUpDto.email}`;
  }

  login(loginDto: LoginDto) {
    return `Logging in user with email: ${loginDto.email}`;
  }
}
