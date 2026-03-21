import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PacientesService } from '../services/pacientes/pacientes.service.js';
import { PacientesController } from '../controllers/pacientes/pacientes.controller.js';

import { Paciente } from '../entities/pacientes/paciente.entity.js';
import { PacienteTutor } from '../entities/pacientes/paciente-tutor.entity.js';
import { PacienteCondicion } from '../entities/pacientes/paciente-condicion.entity.js';
import { Cliente } from '../entities/personas/cliente.entity.js';

import { AuthModule } from './auth.module.js';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Paciente,
      PacienteTutor,
      PacienteCondicion,
      Cliente,
    ]),
  ],
  controllers: [PacientesController],
  providers: [PacientesService],
  exports: [PacientesService],
})
export class PacientesModule {}
