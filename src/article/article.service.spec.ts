import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { beforeEach, describe, it } from 'node:test';

describe('PostsService', () => {
  let service: ArticleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleService],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
  });

  it('should be defined', () => {
    // @ts-ignore
    expect(service).toBeDefined();
  });
});
