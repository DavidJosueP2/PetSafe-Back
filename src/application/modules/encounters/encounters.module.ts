import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EncountersService } from '../../services/encounters/encounters.service.js';
import { EncountersController } from '../../../presentation/controllers/encounters/encounters.controller.js';

import { Encounter } from '../../../domain/entities/encounters/encounter.entity.js';
import { Patient } from '../../../domain/entities/patients/patient.entity.js';
import { Employee } from '../../../domain/entities/persons/employee.entity.js';
import { QueueEntry } from '../../../domain/entities/appointments/queue-entry.entity.js';

import { EncounterConsultationReason } from '../../../domain/entities/encounters/encounter-consultation-reason.entity.js';
import { EncounterAnamnesis } from '../../../domain/entities/encounters/encounter-anamnesis.entity.js';
import { EncounterClinicalExam } from '../../../domain/entities/encounters/encounter-clinical-exam.entity.js';
import { EncounterEnvironmentalData } from '../../../domain/entities/encounters/encounter-environmental-data.entity.js';
import { EncounterClinicalImpression } from '../../../domain/entities/encounters/encounter-clinical-impression.entity.js';
import { EncounterPlan } from '../../../domain/entities/encounters/encounter-plan.entity.js';
import { UserRole } from '../../../domain/entities/auth/user-role.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Encounter,
      Patient,
      Employee,
      QueueEntry,
      EncounterConsultationReason,
      EncounterAnamnesis,
      EncounterClinicalExam,
      EncounterEnvironmentalData,
      EncounterClinicalImpression,
      EncounterPlan,
      UserRole,
    ]),
  ],
  controllers: [EncountersController],
  providers: [EncountersService],
  exports: [EncountersService],
})
export class EncountersModule {}
