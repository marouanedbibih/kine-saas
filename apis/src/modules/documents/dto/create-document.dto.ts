import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  documentType: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  signed?: boolean;
}
