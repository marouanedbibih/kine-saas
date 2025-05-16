import { Module } from '@nestjs/common';
import { EmergencyContactController } from './controllers/emergency-contact.controller';
import { EmergencyContactService } from './services/emergency-contact.service';
import { EmergencyContact } from './emergency-contact.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EmergencyContact])],
  controllers: [EmergencyContactController],
  providers: [EmergencyContactService],
  exports: [EmergencyContactService], // Export the service so it can be used in other modules
})
export class EmergencyContactModule {}
