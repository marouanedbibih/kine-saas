import { Module } from '@nestjs/common';
import { EmergencyContactController } from './controllers/emergency-contact/emergency-contact.controller';
import { EmergencyContactService } from './services/emergency-contact/emergency-contact.service';
import { EmergencyContactService } from './services/emergency-contact/emergency-contact.service';

@Module({
  controllers: [EmergencyContactController],
  providers: [EmergencyContactService]
})
export class EmergencyContactModule {}
