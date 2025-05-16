import { Module } from '@nestjs/common';
import { InsuranceInfoController } from './controllers/insurance-info.controller';
import { InsuranceInfoService } from './services/insurance-info.service';
import { InsuranceInfo } from './insurance-info.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([InsuranceInfo])],
  controllers: [InsuranceInfoController],
  providers: [InsuranceInfoService],
  exports: [InsuranceInfoService], // Export the service so it can be used in other modules
})
export class InsuranceInfoModule {}
