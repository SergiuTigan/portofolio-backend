import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BlogPostsService } from './blog-posts.service';
import {
  CreateBlogPostDto,
  UpdateBlogPostDto,
} from './schemas/blog-post.model';
import { BlogPost } from './schemas/blog-post.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('blog-posts')
export class BlogPostsController {
  constructor(private readonly postsService: BlogPostsService) {}

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
  create(@Body() createPostDto: CreateBlogPostDto): Promise<BlogPost> {
    return this.postsService.createBlogPost(createPostDto);
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
