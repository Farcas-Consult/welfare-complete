import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';
import { Claim } from './entities/claim.entity';
import { ClaimDocument } from './entities/claim-document.entity';
import { ClaimApproval } from './entities/claim-approval.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Claim, ClaimDocument, ClaimApproval])],
  controllers: [ClaimsController],
  providers: [ClaimsService],
  exports: [ClaimsService],
})
export class ClaimsModule {}

