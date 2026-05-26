import { Test, TestingModule } from '@nestjs/testing';
import { BusinessUiController } from './business-ui.controller';

describe('BusinessUiController', () => {
  let controller: BusinessUiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessUiController],
    }).compile();

    controller = module.get<BusinessUiController>(BusinessUiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
