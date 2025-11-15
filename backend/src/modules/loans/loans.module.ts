import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';
import { Loan } from './entities/loan.entity';
import { LoanProduct } from './entities/loan-product.entity';
import { LoanGuarantor } from './entities/loan-guarantor.entity';
import { LoanRepayment } from './entities/loan-repayment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, LoanProduct, LoanGuarantor, LoanRepayment])],
  controllers: [LoansController],
  providers: [LoansService],
  exports: [LoansService],
})
export class LoansModule {}

