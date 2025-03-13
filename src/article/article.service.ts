import { Injectable, NotFoundException } from '@nestjs/common';
import { Article, ArticleDocument } from './schemas/article.schema';
import { UpdateArticleDto } from './schemas/article.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { del, put } from '@vercel/blob';
import { extname } from 'path';
import { environment } from '../../.env.local';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  getArticles(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

  getArticle(id: string): Promise<Article> {
    return this.articleModel.findOne({ _id: id }).exec();
  }

  async createArticle(
    article: {
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
  ): Promise<Article> {
    // Create file URLs object to store uploaded file URLs
    const fileUrls: any = {};

    try {
      // Upload cover image if exists
      if (files.coverImage?.[0]) {
        const coverFile = files.coverImage[0];
        const coverBlob = await put(
          `Articles/temp-${Date.now()}/cover-image${extname(coverFile.originalname)}`,
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
          `Articles/temp-${Date.now()}/thumbnail${extname(thumbnailFile.originalname)}`,
          thumbnailFile.buffer,
          {
            token: environment.BLOB_READ_WRITE_TOKEN,
            contentType: thumbnailFile.mimetype,
            access: 'public',
          },
        );
        fileUrls.thumbnail = thumbnailBlob.url;
      }
      if (files.images?.length) {
        // Parse image metadata
        let imageMetadata = [];
        if (article.images) {
          try {
            imageMetadata = article.images;
          } catch (e) {
            console.error('Failed to parse image metadata');
          }
        }

        fileUrls.images = await Promise.all(
          files.images.map(async (file, index) => {
            const blob = await put(
              `Articles/temp-${Date.now()}/images/${index}${extname(file.originalname)}`,
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

      // Prepare complete article data with file URLs
      const completeArticleData = {
        ...article,
        ...fileUrls,
        author: article.author,
      };

      // Create and save the article
      const newArticle = new this.articleModel(completeArticleData);
      return await newArticle.save();
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  }

  async editArticle(
    id: string,
    article: UpdateArticleDto,
    files: {
      coverImage?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ): Promise<Article> {
    // Check if article exists
    const existingArticle: Article = await this.articleModel.findById(id);
    if (!existingArticle) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    // Prepare update data
    const updateData = { ...article };
    const fileUrls: any = {};
    if (
      !existingArticle.coverImage.includes(files.coverImage[0].originalname)
    ) {
      if (files.coverImage?.[0]) {
        await del(existingArticle.coverImage, {
          token: environment.BLOB_READ_WRITE_TOKEN,
        });
        existingArticle.coverImage = '';
        const coverFile = files.coverImage[0];
        const coverBlob = await put(
          `Articles/temp-${Date.now()}/cover-image${extname(coverFile.originalname)}`,
          coverFile.buffer,
          {
            token: environment.BLOB_READ_WRITE_TOKEN,
            contentType: coverFile.mimetype,
            access: 'public',
          },
        );
        fileUrls.coverImage = coverBlob.url;
      } else {
        throw new NotFoundException('Cover image not found');
      }
    }

    if (!existingArticle.thumbnail.includes(files.thumbnail[0].originalname)) {
      if (files.thumbnail?.[0]) {
        await del(existingArticle.thumbnail, {
          token: environment.BLOB_READ_WRITE_TOKEN,
        });
        existingArticle.thumbnail = '';
        const thumbnailFile = files.thumbnail[0];
        const thumbnailBlob = await put(
          `Articles/temp-${Date.now()}/thumbnail${extname(thumbnailFile.originalname)}`,
          thumbnailFile.buffer,
          {
            token: environment.BLOB_READ_WRITE_TOKEN,
            contentType: thumbnailFile.mimetype,
            access: 'public',
          },
        );
        fileUrls.thumbnail = thumbnailBlob.url;
      } else {
        throw new NotFoundException('Thumbnail image not found');
      }
    }

    if (files.images?.length) {
      // Parse image metadata
      let imageMetadata = [];
      if (article.images) {
        try {
          imageMetadata = article.images;
        } catch (e) {
          console.error('Failed to parse image metadata');
        }
      }

      fileUrls.images = await Promise.all(
        files.images.map(async (file, index) => {
          const blob = await put(
            `Articles/temp-${Date.now()}/images/${index}${extname(file.originalname)}`,
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

    return this.updateArticle(id, updateData, fileUrls);
  }

  updateArticle(
    id: string,
    article: UpdateArticleDto,
    fileUrls: string[],
  ): Promise<Article> {
    return this.articleModel
      .findByIdAndUpdate(id, { ...article, ...fileUrls }, { new: true })
      .exec();
  }

  deleteArticle(id: string): string {
    this.articleModel.deleteOne({ _id: id }).exec().then();
    return `Post with id: ${id} was deleted`;
  }
}
