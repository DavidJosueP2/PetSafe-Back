import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PacientesService } from '../../services/pacientes/pacientes.service.js';
import { CreatePacienteDto } from '../../dto/pacientes/create-paciente.dto.js';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard.js';
import { RolesGuard } from '../../guards/roles.guard.js';
import { Roles } from '../../decorators/roles.decorator.js';
import { RoleEnum } from '../../common/enums/index.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Roles(RoleEnum.CLIENTE_APP, RoleEnum.ADMIN, RoleEnum.RECEPCIONISTA)
  @Post()
  create(
    @Body() dto: CreatePacienteDto,
    @Request() req: { user: { userId: string } },
  ) {
    return this.pacientesService.create(dto, req.user.userId);
  }

  @Roles(RoleEnum.CLIENTE_APP, RoleEnum.ADMIN, RoleEnum.MVZ, RoleEnum.RECEPCIONISTA)
  @Get()
  findAll(@Request() req: { user: { userId: string } }) {
    return this.pacientesService.findAllByUser(req.user.userId);
  }

  @Roles(RoleEnum.CLIENTE_APP, RoleEnum.ADMIN, RoleEnum.MVZ, RoleEnum.RECEPCIONISTA)
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { userId: string } },
  ) {
    return this.pacientesService.findOne(id, req.user.userId);
  }
}
