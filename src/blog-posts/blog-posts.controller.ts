import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BlogPostsService } from './blog-posts.service';
import {
  CreateBlogPostDto,
  UpdateBlogPostDto,
} from './schemas/blog-post.models';
import { BlogPost } from './schemas/blog-post.schema';

@Controller('blog-posts')
export class BlogPostsController {
  constructor(private readonly postsService: BlogPostsService) {}

  @Get()
  async findAll(): Promise<BlogPost[]> {
    return this.postsService.getPosts();
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    return this.postsService.getPost(id);
  }

  @Post()
  create(@Body() createPostDto: CreateBlogPostDto): string {
    return this.postsService.createBlogPost(createPostDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdateBlogPostDto,
  ): string {
    return this.postsService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): void {
    this.postsService.deletePost(id);
  }
}
