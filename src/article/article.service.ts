import { Injectable } from '@nestjs/common';
import { Article, ArticleDocument } from './schemas/article.schema';
import { UpdateArticleDto } from './schemas/article.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { put } from '@vercel/blob';
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

  async createOrUpdateArticle(
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
    let newArticle = await this.articleModel
      .findOne({ title: article.title })
      .exec();
    if (!newArticle) {
      newArticle = new this.articleModel(article);
      newArticle.save().then();
    }
    const articleId = String(newArticle._id);
    const fileUrls: any = {};

    // Upload cover image if exists
    if (files.coverImage?.[0]) {
      const coverFile = files.coverImage[0];
      const coverBlob = await put(
        `Articles/${newArticle._id}/cover-image${extname(coverFile.originalname)}`,
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

    fileUrls.author = article.author;

    return this.updateArticle(articleId, fileUrls);
  }

  updateArticle(id: string, article: UpdateArticleDto): Promise<Article> {
    return this.articleModel
      .findByIdAndUpdate(id, article, { new: true })
      .exec();
  }

  deleteArticle(id: string): string {
    this.articleModel.deleteOne({ _id: id }).exec().then();
    return `Post with id: ${id} was deleted`;
  }
}
