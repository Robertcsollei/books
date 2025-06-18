import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser, UserPayload } from '../auth/decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { UpdateUserDto } from './dto';

@ApiTags('User')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  getLoggedInUser(@GetUser() user: UserPayload) {
    return user;
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user' })
  updateLoggedInUser(@GetUser('id') userId: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(userId, dto);
  }
}
