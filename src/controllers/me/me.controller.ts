import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard.js';
import { RolesGuard } from '../../guards/roles.guard.js';
import { Roles } from '../../decorators/roles.decorator.js';
import { RoleEnum } from '../../common/enums/index.js';

import { ClientesService } from '../../services/clientes/clientes.service.js';
import { UpdateMyClienteDto } from '../../dto/clientes/update-my-cliente.dto.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('me')
export class MeController {
  constructor(private readonly clientesService: ClientesService) {}

  @Roles(RoleEnum.CLIENTE_APP)
  @Get('profile')
  getProfile(@Request() req: { user: { userId: string } }) {
    return this.clientesService.getMyProfile(req.user.userId);
  }

  @Roles(RoleEnum.CLIENTE_APP)
  @Patch('update')
  update(@Body() dto: UpdateMyClienteDto, @Request() req: { user: { userId: string } }) {
    return this.clientesService.updateMyProfile(req.user.userId, dto);
  }
}
