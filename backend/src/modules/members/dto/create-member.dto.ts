import { IsString, IsEmail, IsOptional, IsDateString, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'Middle', required: false })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({ example: '12345678', required: false })
  @IsOptional()
  @IsString()
  nationalId?: string;

  @ApiProperty({ example: '+254712345678' })
  @IsString()
  phonePrimary: string;

  @ApiProperty({ example: 'john.doe@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '1990-01-01', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ example: 'male', required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ example: 'active', enum: ['active', 'inactive', 'suspended', 'deceased'], required: false })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'suspended', 'deceased'])
  status?: 'active' | 'inactive' | 'suspended' | 'deceased';

  @ApiProperty({ example: 'uuid', required: false })
  @IsOptional()
  @IsString()
  planId?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  kycStatus?: boolean;
}

