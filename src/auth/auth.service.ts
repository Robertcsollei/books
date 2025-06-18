import { Injectable } from '@nestjs/common';
import { SignUpDto, LoginDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signup(signUpDto: SignUpDto) {
    const hashedPassword = await argon.hash(signUpDto.password);
    const user = await this.prisma.user.create({
      data: {
        email: signUpDto.email,
        password: hashedPassword,
        username: signUpDto.email,
        firstName: signUpDto.firstName,
        lastName: signUpDto.lastName,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
      },
    });
    return user;
  }

  login(loginDto: LoginDto) {
    return `Logging in user with email: ${loginDto.email}`;
  }
}
