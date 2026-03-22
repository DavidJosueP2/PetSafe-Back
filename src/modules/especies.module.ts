import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EspeciesService } from '../services/especies/especies.service.js';
import { EspeciesController } from '../controllers/especies/especies.controller.js';
import { EspecieCatalogo } from '../entities/catalogos/especie-catalogo.entity.js';
import { AuthModule } from './auth.module.js';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([EspecieCatalogo])],
  controllers: [EspeciesController],
  providers: [EspeciesService],
  exports: [EspeciesService],
})
export class EspeciesModule {}
