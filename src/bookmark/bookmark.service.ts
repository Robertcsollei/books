import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async getBookmarks(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [bookmarks, total] = await Promise.all([
      this.prisma.bookmark.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.bookmark.count(),
    ]);

    return {
      data: bookmarks,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  createBookmark(dto: CreateBookmarkDto) {
    const { userId, ...rest } = dto;
    return this.prisma.bookmark.create({
      data: {
        ...rest,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  getBookmarkById(id: string) {
    return this.prisma.bookmark.findUnique({
      where: { id },
    });
  }

  updateBookmark(id: string, dto: CreateBookmarkDto) {
    return this.prisma.bookmark.update({
      where: { id },
      data: dto,
    });
  }

  deleteBookmark(id: string) {
    return this.prisma.bookmark.delete({
      where: { id },
    });
  }
}
