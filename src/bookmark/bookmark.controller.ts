import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Bookmarks')
@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get()
  @ApiOperation({ summary: 'Get all bookmarks with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  getBookmarks(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.bookmarkService.getBookmarks(page, limit);
  }

  @Post()
  createBookmark(@Body() dto: CreateBookmarkDto) {
    return this.bookmarkService.createBookmark(dto);
  }

  @Get(':id')
  getBookmarkById(@Param('id') id: string) {
    return this.bookmarkService.getBookmarkById(id);
  }

  @Patch(':id')
  updateBookmark(@Param('id') id: string, @Body() dto: CreateBookmarkDto) {
    return this.bookmarkService.updateBookmark(id, dto);
  }

  @Delete(':id')
  deleteBookmark(@Param('id') id: string) {
    return this.bookmarkService.deleteBookmark(id);
  }
}
