import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SignUpDto, LoginDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
