import { Module } from '@nestjs/common';
import { CatService } from './cat.service';
import { CatController } from './cat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat } from './cat.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [CatService],
  controllers: [CatController],
  exports: [CatService, TypeOrmModule],
  imports: [TypeOrmModule.forFeature([Cat]), AuthModule],
})
export class CatModule {}
