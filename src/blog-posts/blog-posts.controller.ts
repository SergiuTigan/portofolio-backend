import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BlogPostsService } from './blog-posts.service';
import {
  CreateBlogPostDto,
  UpdateBlogPostDto,
} from './schemas/blog-post.model';
import { BlogPost } from './schemas/blog-post.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UsersService } from '../users/users.service';

@Controller('blog-posts')
export class BlogPostsController {
  constructor(
    private readonly postsService: BlogPostsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async findAll(): Promise<BlogPost[]> {
    return this.postsService.getPosts();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BlogPost> {
    return this.postsService.getPost(id);
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
    @Body() createPostDto: CreateBlogPostDto,
    @UploadedFiles()
    files: {
      coverImage: Express.Multer.File[];
      thumbnail: Express.Multer.File[];
      images: Express.Multer.File[];
    },
  ): Promise<BlogPost> {
    return this.postsService.createBlogPost(
      {
        ...createPostDto,
        author: await this.usersService.findOne(createPostDto.authorId),
        coverImage: 'x',
        thumbnail: 'x',
        images: [],
      },
      files,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdateBlogPostDto,
  ): Promise<BlogPost> {
    return this.postsService.updatePost(id, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): string {
    return this.postsService.deletePost(id);
  }
}
