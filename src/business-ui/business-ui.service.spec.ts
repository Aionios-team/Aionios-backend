import { Test, TestingModule } from '@nestjs/testing';
import { BusinessUiService } from './business-ui.service';

describe('BusinessUiService', () => {
  let service: BusinessUiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessUiService],
    }).compile();

    service = module.get<BusinessUiService>(BusinessUiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
