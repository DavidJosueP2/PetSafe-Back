import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/typeorm.config.js';
import { AuthModule } from './modules/auth.module.js';
import { PacientesModule } from './modules/pacientes.module.js';
import { ClientesModule } from './modules/clientes.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
    PacientesModule,
    ClientesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
