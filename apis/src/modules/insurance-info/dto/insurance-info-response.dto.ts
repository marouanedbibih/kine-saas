import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class InsuranceInfoResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  provider: string;

  @ApiProperty()
  @Expose()
  policyNumber: string;

  @ApiProperty({ required: false })
  @Expose()
  groupNumber?: string;

  @ApiProperty()
  @Expose()
  primaryInsuredName: string;

  @ApiProperty({ required: false })
  @Expose()
  relationship?: string;

  @ApiProperty({ required: false })
  @Expose()
  coverageDetails?: string;

  @ApiProperty({ required: false })
  @Expose()
  validUntil?: Date;
}
