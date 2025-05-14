import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

class KineInfo {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  licenseNumber: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;
}

@Exclude()
export class PatientResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  numeroPatient: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  telephone: string;

  @ApiProperty()
  @Expose()
  adresse: string;

  @ApiProperty()
  @Expose()
  dateNaissance: Date;

  @ApiProperty()
  @Expose()
  contactUrgence: string;

  @ApiProperty({ type: KineInfo })
  @Expose()
  @Type(() => KineInfo)
  kinesitherapeute: KineInfo;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
