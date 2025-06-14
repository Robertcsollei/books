import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsPhoneNumber,
  Length,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({ example: '123 Main St', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'New York', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'NY', required: false })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  state?: string;

  @ApiProperty({ example: '10001', required: false })
  @IsOptional()
  @IsString()
  @Length(5, 10)
  zip?: string;

  @ApiProperty({ example: 'USA', required: false })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  country?: string;

  @ApiProperty({ example: 'StrongP@ssw0rd' })
  @IsString()
  @MinLength(8)
  password: string;
}
