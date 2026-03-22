import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';

import { ClientesService } from '../../services/clientes/clientes.service.js';
import {
  CreateClienteDto,
  UpdateClienteDto,
  ListClientesQueryDto,
} from '../../dto/clientes/index.js';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard.js';
import { RolesGuard } from '../../guards/roles.guard.js';
import { Roles } from '../../decorators/roles.decorator.js';
import { RoleEnum } from '../../common/enums/index.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Roles(RoleEnum.ADMIN, RoleEnum.RECEPCIONISTA)
  @Post()
  create(
    @Body() dto: CreateClienteDto,
  ) {
    return this.clientesService.create(dto);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.MVZ, RoleEnum.RECEPCIONISTA, RoleEnum.CLIENTE_APP)
  @Get()
  findAll(
    @Query() query: ListClientesQueryDto,
    @Request() req: { user: { userId: string } },
  ) {
    return this.clientesService.findAll(query, req.user.userId);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.MVZ, RoleEnum.RECEPCIONISTA, RoleEnum.CLIENTE_APP)
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { userId: string } },
  ) {
    return this.clientesService.findOne(id, req.user.userId);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.RECEPCIONISTA)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateClienteDto,
  ) {
    return this.clientesService.update(id, dto);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.RECEPCIONISTA)
  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { userId: string } },
  ) {
    return this.clientesService.remove(id, req.user.userId);
  }
}
