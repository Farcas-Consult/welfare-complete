import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContributionsController } from './contributions.controller';
import { ContributionsService } from './contributions.service';
import { Invoice } from './entities/invoice.entity';
import { MembershipPlan } from './entities/membership-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, MembershipPlan])],
  controllers: [ContributionsController],
  providers: [ContributionsService],
  exports: [ContributionsService],
})
export class ContributionsModule {}

