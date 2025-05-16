import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class EmergencyContactResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  relationship: string;

  @ApiProperty()
  @Expose()
  phoneNumber: string;

  @ApiProperty({ required: false })
  @Expose()
  email?: string;
}
