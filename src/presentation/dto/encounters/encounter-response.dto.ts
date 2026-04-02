import {
  UpdateEncounterAnamnesisDto,
  UpdateEncounterClinicalExamDto,
  UpdateEncounterClinicalImpressionDto,
  UpdateEncounterEnvironmentalDataDto,
  UpdateEncounterPlanDto,
  UpdateEncounterReasonDto,
} from './update-encounter-tabs.dto.js';

export class EncounterPatientDto {
  id!: number;
  name!: string;
  species!: string;
  breed!: string;
}

export class EncounterDetailResponseDto {
  id!: number;
  patientId!: number;
  veterinarianId!: number;
  queueEntryId!: number | null;
  appointmentId!: number | null;
  startTime!: string;
  endTime!: string | null;
  status!: string;
  generalNotes!: string | null;

  patient!: EncounterPatientDto;

  // 1:1 Tabs
  consultationReason!: UpdateEncounterReasonDto | null;
  anamnesis!: UpdateEncounterAnamnesisDto | null;
  clinicalExam!: UpdateEncounterClinicalExamDto | null;
  environmentalData!: UpdateEncounterEnvironmentalDataDto | null;
  clinicalImpression!: UpdateEncounterClinicalImpressionDto | null;
  plan!: UpdateEncounterPlanDto | null;

  // 1:N Actions (Listas simples de momento para visualización básica)
  treatmentsCount!: number;
  vaccinesCount!: number;
  dewormingCount!: number;
  surgeriesCount!: number;
  proceduresCount!: number;
}
