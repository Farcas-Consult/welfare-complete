import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { Member } from './entities/member.entity';
import { Dependent } from './entities/dependent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Dependent])],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule {}

