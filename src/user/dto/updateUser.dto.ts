import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'The username of the user' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ description: 'The first name of the user' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ description: 'The last name of the user' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ description: 'The phone number of the user' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'The address of the user' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: 'The city of the user' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: 'The state of the user' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ description: 'The zip code of the user' })
  @IsString()
  @IsOptional()
  zip?: string;

  @ApiProperty({ description: 'The country of the user' })
  @IsString()
  @IsOptional()
  country?: string;
}
