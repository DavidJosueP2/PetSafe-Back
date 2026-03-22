import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RazasService } from '../services/razas/razas.service.js';
import { RazasController } from '../controllers/razas/razas.controller.js';
import { RazaCatalogo } from '../entities/catalogos/raza-catalogo.entity.js';
import { EspecieCatalogo } from '../entities/catalogos/especie-catalogo.entity.js';
import { AuthModule } from './auth.module.js';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([RazaCatalogo, EspecieCatalogo])],
  controllers: [RazasController],
  providers: [RazasService],
  exports: [RazasService],
})
export class RazasModule {}
