import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/typeorm.config.js';
import { AuthModule } from './modules/auth.module.js';
import { PacientesModule } from './modules/pacientes.module.js';
import { ClientesModule } from './modules/clientes.module.js';
import { EspeciesModule } from './modules/especies.module.js';
import { RazasModule } from './modules/razas.module.js';
import { ColoresModule } from './modules/colores.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
    PacientesModule,
    ClientesModule,
    EspeciesModule,
    RazasModule,
    ColoresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
