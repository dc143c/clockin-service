import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('Application', () => {
    it('should return an object with status 200', () => {
      expect(appController.getStatus()).toMatchObject({
        status: 200,
        health: 'OK',
      });
    });
  });
});
