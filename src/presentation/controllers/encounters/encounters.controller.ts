import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EncountersService } from '../../../application/services/encounters/encounters.service.js';
import { CreateEncounterDto } from '../../dto/encounters/create-encounter.dto.js';
import { EncounterDetailResponseDto } from '../../dto/encounters/encounter-response.dto.js';
import {
  UpdateEncounterAnamnesisDto,
  UpdateEncounterClinicalExamDto,
  UpdateEncounterClinicalImpressionDto,
  UpdateEncounterEnvironmentalDataDto,
  UpdateEncounterPlanDto,
  UpdateEncounterReasonDto,
} from '../../dto/encounters/update-encounter-tabs.dto.js';

import { JwtAuthGuard } from '../../../infra/security/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../../infra/security/guards/roles.guard.js';
import { Roles } from '../../../infra/security/decorators/roles.decorator.js';
import { RoleEnum } from '../../../domain/enums/index.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('encounters')
export class EncountersController {
  constructor(private readonly encountersService: EncountersService) {}

  // ── INICIAR CONSULTA ──
  @Roles(RoleEnum.ADMIN, RoleEnum.MVZ)
  @Post()
  create(
    @Body() dto: CreateEncounterDto,
    @Request() req: { user: { userId: number } },
  ): Promise<EncounterDetailResponseDto> {
    return this.encountersService.create(dto, req.user.userId);
  }

  // ── OBTENER CONSULTA ──
  @Roles(RoleEnum.ADMIN, RoleEnum.MVZ)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<EncounterDetailResponseDto> {
    return this.encountersService.findOne(id);
  }

  // ── FINALIZAR CONSULTA ──
  @Roles(RoleEnum.ADMIN, RoleEnum.MVZ)
  @Patch(':id/finish')
  finish(@Param('id', ParseIntPipe) id: number): Promise<EncounterDetailResponseDto> {
    return this.encountersService.finish(id);
  }

  // ── PESTAÑAS (TABS) ──
  @Roles(RoleEnum.ADMIN, RoleEnum.MVZ)
  @Put(':id/reason')
  updateReason(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEncounterReasonDto,
  ) {
    return this.encountersService.updateReason(id, dto);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.MVZ)
  @Put(':id/anamnesis')
  updateAnamnesis(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEncounterAnamnesisDto,
  ) {
    return this.encountersService.updateAnamnesis(id, dto);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.MVZ)
  @Put(':id/clinical-exam')
  updateClinicalExam(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEncounterClinicalExamDto,
  ) {
    return this.encountersService.updateClinicalExam(id, dto);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.MVZ)
  @Put(':id/environmental-data')
  updateEnvironmentalData(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEncounterEnvironmentalDataDto,
  ) {
    return this.encountersService.updateEnvironmentalData(id, dto);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.MVZ)
  @Put(':id/impression')
  updateImpression(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEncounterClinicalImpressionDto,
  ) {
    return this.encountersService.updateImpression(id, dto);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.MVZ)
  @Put(':id/plan')
  updatePlan(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEncounterPlanDto,
  ) {
    return this.encountersService.updatePlan(id, dto);
  }
}
