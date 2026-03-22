import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientesController } from '../controllers/clientes/clientes.controller.js';
import { MeController } from '../controllers/me/me.controller.js';
import { ClientesService } from '../services/clientes/clientes.service.js';

import { Cliente } from '../entities/personas/cliente.entity.js';
import { Persona } from '../entities/personas/persona.entity.js';
import { Usuario } from '../entities/auth/usuario.entity.js';
import { UsuarioRol } from '../entities/auth/usuario-rol.entity.js';

import { AuthModule } from './auth.module.js';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Cliente, Persona, Usuario, UsuarioRol])],
  controllers: [ClientesController, MeController],
  providers: [ClientesService],
  exports: [ClientesService],
})
export class ClientesModule {}
