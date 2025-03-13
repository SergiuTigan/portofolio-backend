import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { beforeEach, describe } from 'node:test';

describe('ArticlesController', () => {
  let controller: ArticleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
    }).compile();

    controller = module.get<ArticleController>(ArticleController);
  });
});

function expect(controller: ArticleController) {
  throw new Error('Function not implemented.');
}
