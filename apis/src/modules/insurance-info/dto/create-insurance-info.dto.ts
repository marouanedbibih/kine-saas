import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsPhoneNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInsuranceInfoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  provider: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  policyNumber: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groupNumber?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  primaryInsuredName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  relationship?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  coverageDetails?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  validUntil?: string;
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsPhoneNumber()
  insurancePhone?: string;
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  secondaryProvider?: string;
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  secondaryPolicyNumber?: string;
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  secondaryGroupNumber?: string;
}
