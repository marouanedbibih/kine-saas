import { Module } from '@nestjs/common';
import { InsuranceInfoController } from './controllers/insurance-info/insurance-info.controller';
import { InsuranceInfoService } from './services/insurance-info/insurance-info.service';

@Module({
  controllers: [InsuranceInfoController],
  providers: [InsuranceInfoService]
})
export class InsuranceInfoModule {}
