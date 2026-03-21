import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { typeOrmAsyncConfig } from './config/typeorm.config.js';
import { AuthModule } from './modules/auth.module.js';
import { PacientesModule } from './modules/pacientes.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
    PacientesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
