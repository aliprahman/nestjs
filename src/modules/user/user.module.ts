import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/databases/entities/user.entity';
import { MasterDataUserController } from './controller/master-data-user.controller';
import { MasterDataUserService } from './service/master-data-user.service';
import { ProfileUserController } from './controller/profile-user.controller';
import { ProfileUserService } from './service/profile-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [MasterDataUserController, ProfileUserController],
  providers: [MasterDataUserService, ProfileUserService],
  exports: [TypeOrmModule, MasterDataUserService],
})
export class UserModule {}
