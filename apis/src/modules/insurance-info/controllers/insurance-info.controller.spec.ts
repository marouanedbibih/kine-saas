import { Test, TestingModule } from '@nestjs/testing';
import { InsuranceInfoController } from './insurance-info.controller';

describe('InsuranceInfoController', () => {
  let controller: InsuranceInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsuranceInfoController],
    }).compile();

    controller = module.get<InsuranceInfoController>(InsuranceInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
