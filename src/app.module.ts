import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuditSubscriber } from './common/subscribers';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './modules/task/task.module';
import { JwtGlobalModule } from './jwt-global/jwt-global.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    UserModule,
    TaskModule,
    JwtGlobalModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuditSubscriber],
})
export class AppModule {}
