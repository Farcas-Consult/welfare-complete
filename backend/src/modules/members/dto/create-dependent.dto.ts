import { IsString, IsOptional, IsDateString, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDependentDto {
  @ApiProperty({ example: 'Jane' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'spouse' })
  @IsString()
  relationship: string;

  @ApiProperty({ example: '1995-01-01', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ example: '12345678', required: false })
  @IsOptional()
  @IsString()
  nationalId?: string;

  @ApiProperty({ example: '+254712345678', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isBeneficiary?: boolean;

  @ApiProperty({ example: 50, required: false })
  @IsOptional()
  @IsNumber()
  benefitPercentage?: number;
}

