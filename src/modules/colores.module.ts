import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ColoresService } from '../services/colores/colores.service.js';
import { ColoresController } from '../controllers/colores/colores.controller.js';
import { ColorCatalogo } from '../entities/catalogos/color-catalogo.entity.js';
import { AuthModule } from './auth.module.js';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([ColorCatalogo])],
  controllers: [ColoresController],
  providers: [ColoresService],
  exports: [ColoresService],
})
export class ColoresModule {}
