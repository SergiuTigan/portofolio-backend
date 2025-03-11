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
import { extname } from 'path';
import { environment } from '../../.env.local';
import { put } from '@vercel/blob';

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
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'coverImage', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 10 },
      ],
      {
        storage: undefined, // No disk storage, use memory storage for Blob
      },
    ),
  )
  async create(
    @Body() createPostDto: CreateBlogPostDto,
    @UploadedFiles()
    files: {
      coverImage?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ): Promise<BlogPost> {
    // First create the blog post to get an ID
    const blogPost = await this.postsService.createBlogPost({
      ...createPostDto,
      coverImage: '',
      thumbnail: '',
      images: [],
    });

    const articleId = blogPost._id;
    const fileUrls: any = {};

    // Upload cover image if exists
    if (files.coverImage?.[0]) {
      const coverFile = files.coverImage[0];
      const coverBlob = await put(
        `Articles/${articleId}/cover-image${extname(coverFile.originalname)}`,
        coverFile.buffer,
        {
          token: environment.BLOB_READ_WRITE_TOKEN,
          contentType: coverFile.mimetype,
          access: 'public',
        },
      );
      fileUrls.coverImage = coverBlob.url;
    }

    // Upload thumbnail if exists
    if (files.thumbnail?.[0]) {
      const thumbnailFile = files.thumbnail[0];
      const thumbnailBlob = await put(
        `Articles/${articleId}/thumbnail${extname(thumbnailFile.originalname)}`,
        thumbnailFile.buffer,
        {
          token: environment.BLOB_READ_WRITE_TOKEN,
          contentType: thumbnailFile.mimetype,
          access: 'public',
        },
      );
      fileUrls.thumbnail = thumbnailBlob.url;
    }

    // Upload additional images if exist
    if (files.images?.length) {
      // Parse image metadata if sent as JSON string
      let imageMetadata = [];
      if (createPostDto.images) {
        try {
          imageMetadata = createPostDto.images;
        } catch (e) {
          console.error('Failed to parse image metadata');
        }
      }

      fileUrls.images = await Promise.all(
        files.images.map(async (file, index) => {
          const blob = await put(
            `Articles/${articleId}/images/${index}${extname(file.originalname)}`,
            file.buffer,
            {
              token: environment.BLOB_READ_WRITE_TOKEN,
              contentType: file.mimetype,
              access: 'public',
            },
          );

          return {
            url: blob.url,
            description: imageMetadata[index]?.description || '',
          };
        }),
      );
    }

    return await this.postsService.updatePost(articleId, fileUrls);
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
