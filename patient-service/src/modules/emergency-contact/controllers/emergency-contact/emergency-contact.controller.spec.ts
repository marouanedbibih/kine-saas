import { Test, TestingModule } from '@nestjs/testing';
import { EmergencyContactController } from './emergency-contact.controller';

describe('EmergencyContactController', () => {
  let controller: EmergencyContactController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmergencyContactController],
    }).compile();

    controller = module.get<EmergencyContactController>(EmergencyContactController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
