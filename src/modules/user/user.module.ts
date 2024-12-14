import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/databases/entities/user.entity';
import { MasterDataUserController } from './controller/master-data-user.controller';
import { MasterDataUserService } from './service/master-data-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [MasterDataUserController],
  providers: [MasterDataUserService],
  exports: [TypeOrmModule],
})
export class UserModule {}
