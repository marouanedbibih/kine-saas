import { Test, TestingModule } from '@nestjs/testing';
import { InsuranceInfoService } from './insurance-info.service';

describe('InsuranceInfoService', () => {
  let service: InsuranceInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InsuranceInfoService],
    }).compile();

    service = module.get<InsuranceInfoService>(InsuranceInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
