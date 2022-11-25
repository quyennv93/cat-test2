import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CatModule } from './cat/cat.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'test2',
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: true,
      username: 'root',
      password: '123456',
    }),
    CatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
