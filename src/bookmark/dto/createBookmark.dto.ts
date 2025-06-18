import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({ description: 'The title of the bookmark' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The description of the bookmark' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The URL of the bookmark' })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ description: 'The tags of the bookmark' })
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: 'The user ID of the bookmark' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
