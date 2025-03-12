import { Injectable } from '@nestjs/common';
import { BlogPost, BlogPostDocument } from './schemas/blog-post.schema';
import { UpdateBlogPostDto } from './schemas/blog-post.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { put } from '@vercel/blob';
import { extname } from 'path';
import { environment } from '../../.env.local';

@Injectable()
export class BlogPostsService {
  constructor(
    @InjectModel(BlogPost.name) private blogPostModel: Model<BlogPostDocument>,
  ) {}

  getPosts(): Promise<BlogPost[]> {
    return this.blogPostModel.find().exec();
  }

  getPost(id: string): Promise<BlogPost> {
    return this.blogPostModel.findOne({ _id: id }).exec();
  }

  async createBlogPost(
    blogPost: {
      authorEmail?: string;
      images: any[];
      thumbnail: string;
      comments: string[];
      author: {
        firstName: string;
        lastName: string;
        role: string;
        _id: Types.ObjectId;
        avatar: string;
        email: string;
      };
      description: string;
      title: string;
      imageDescriptions?: { [p: string]: string };
      authorId: Types.ObjectId;
      content: string;
      tags: string[];
      coverImage: string;
      category: string;
      createDate: string;
      likes: number;
    },
    files: {
      coverImage: Express.Multer.File[];
      thumbnail: Express.Multer.File[];
      images: Express.Multer.File[];
    },
  ): Promise<BlogPost> {
    const newBlogPost = new this.blogPostModel(blogPost);
    newBlogPost.save().then();
    const articleId = String(newBlogPost._id);
    const fileUrls: any = {};

    // Upload cover image if exists
    if (files.coverImage?.[0]) {
      const coverFile = files.coverImage[0];
      const coverBlob = await put(
        `Articles/${newBlogPost._id}/cover-image${extname(coverFile.originalname)}`,
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
      if (blogPost.images) {
        try {
          imageMetadata = blogPost.images;
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

    fileUrls.author = blogPost.author;

    return this.updatePost(articleId, fileUrls);
  }

  updatePost(id: string, blogPost: UpdateBlogPostDto): Promise<BlogPost> {
    return this.blogPostModel
      .findByIdAndUpdate(id, blogPost, { new: true })
      .exec();
  }

  deletePost(id: string): string {
    this.blogPostModel.deleteOne({ _id: id }).exec().then();
    return `Post with id: ${id} was deleted`;
  }
}
