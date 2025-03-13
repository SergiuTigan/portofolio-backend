import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './schemas/article.model';
import { Article } from './schemas/article.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UsersService } from '../users/users.service';

@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async findAll(): Promise<Article[]> {
    return this.articleService.getArticles();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Article> {
    return this.articleService.getArticle(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'coverImage', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 10 },
      ],
      {
        storage: undefined,
      },
    ),
  )
  async create(
    @Body() createPostDto: CreateArticleDto,
    @UploadedFiles()
    files: {
      coverImage: Express.Multer.File[];
      thumbnail: Express.Multer.File[];
      images: Express.Multer.File[];
    },
  ): Promise<Article> {
    const authorUser = await this.usersService.findOne(createPostDto.authorId);

    const author = {
      _id: authorUser._id,
      firstName: authorUser.firstName,
      lastName: authorUser.lastName,
      email: authorUser.email,
      avatar: authorUser.avatar,
      role: authorUser.role,
    };

    return this.articleService.createOrUpdateArticle(
      {
        ...createPostDto,
        authorId: authorUser._id, // Store the reference ID
        author: author, // Store the author details directly
      },
      files,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): string {
    return this.articleService.deleteArticle(id);
  }
}
