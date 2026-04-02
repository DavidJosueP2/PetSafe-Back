import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

// Entidades base
import { Encounter } from '../../../domain/entities/encounters/encounter.entity.js';
import { Patient } from '../../../domain/entities/patients/patient.entity.js';
import { QueueEntry } from '../../../domain/entities/appointments/queue-entry.entity.js';
import { Employee } from '../../../domain/entities/persons/employee.entity.js';
import { EncounterStatusEnum, QueueStatusEnum } from '../../../domain/enums/index.js';

// Entidades 1:1
import { EncounterConsultationReason } from '../../../domain/entities/encounters/encounter-consultation-reason.entity.js';
import { EncounterAnamnesis } from '../../../domain/entities/encounters/encounter-anamnesis.entity.js';
import { EncounterClinicalExam } from '../../../domain/entities/encounters/encounter-clinical-exam.entity.js';
import { EncounterEnvironmentalData } from '../../../domain/entities/encounters/encounter-environmental-data.entity.js';
import { EncounterClinicalImpression } from '../../../domain/entities/encounters/encounter-clinical-impression.entity.js';
import { EncounterPlan } from '../../../domain/entities/encounters/encounter-plan.entity.js';

// DTOs
import { CreateEncounterDto } from '../../../presentation/dto/encounters/create-encounter.dto.js';
import { EncounterDetailResponseDto, EncounterPatientDto } from '../../../presentation/dto/encounters/encounter-response.dto.js';
import {
  UpdateEncounterAnamnesisDto,
  UpdateEncounterClinicalExamDto,
  UpdateEncounterClinicalImpressionDto,
  UpdateEncounterEnvironmentalDataDto,
  UpdateEncounterPlanDto,
  UpdateEncounterReasonDto,
} from '../../../presentation/dto/encounters/update-encounter-tabs.dto.js';

@Injectable()
export class EncountersService {
  constructor(
    @InjectRepository(Encounter) private readonly encounterRepo: Repository<Encounter>,
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    @InjectRepository(QueueEntry) private readonly queueRepo: Repository<QueueEntry>,
    @InjectRepository(Employee) private readonly employeeRepo: Repository<Employee>,

    @InjectRepository(EncounterConsultationReason) private readonly reasonRepo: Repository<EncounterConsultationReason>,
    @InjectRepository(EncounterAnamnesis) private readonly anamnesisRepo: Repository<EncounterAnamnesis>,
    @InjectRepository(EncounterClinicalExam) private readonly examRepo: Repository<EncounterClinicalExam>,
    @InjectRepository(EncounterEnvironmentalData) private readonly envRepo: Repository<EncounterEnvironmentalData>,
    @InjectRepository(EncounterClinicalImpression) private readonly impressionRepo: Repository<EncounterClinicalImpression>,
    @InjectRepository(EncounterPlan) private readonly planRepo: Repository<EncounterPlan>,
  ) {}

  // ── Helper: Obtener Empleado desde User ID ──
  private async resolveVetId(userId: number): Promise<number> {
    const employee = await this.employeeRepo
      .createQueryBuilder('e')
      .innerJoin('persons', 'p', 'p.id = e.person_id')
      .innerJoin('users', 'u', 'u.person_id = p.id')
      .where('u.id = :userId', { userId })
      .andWhere('e.deleted_at IS NULL')
      .select('e.id')
      .getOne();

    if (!employee) {
      throw new UnprocessableEntityException('El usuario no tiene un perfil clínico.');
    }
    return employee.id;
  }

  // ── 1. Crear Encuentro (Inicio Consulta) ──
  async create(dto: CreateEncounterDto, userId: number): Promise<EncounterDetailResponseDto> {
    const vetId = await this.resolveVetId(userId);

    let patientId = dto.patientId;
    let appointmentId: number | null = null;
    let queueEntryId: number | null = dto.queueEntryId ?? null;

    if (queueEntryId) {
      const q = await this.queueRepo.findOne({ where: { id: queueEntryId, deletedAt: IsNull() } });
      if (!q) throw new NotFoundException('Entrada de cola no encontrada.');
      patientId = q.patientId;
      appointmentId = q.appointmentId;
      
      const existingActive = await this.encounterRepo.findOne({
        where: { queueEntryId, status: EncounterStatusEnum.ACTIVA, deletedAt: IsNull() },
      });
      if (existingActive) {
        return this.findOne(existingActive.id);
      }
      
      // Pasar a EN_ATENCION
      if (q.status === QueueStatusEnum.EN_ESPERA) {
        await this.queueRepo.update(q.id, { status: QueueStatusEnum.EN_ATENCION });
      }
    }

    if (!patientId) {
      throw new BadRequestException('Se requiere patientId o queueEntryId para iniciar la consulta.');
    }

    const patient = await this.patientRepo.findOne({ where: { id: patientId, deletedAt: IsNull() } });
    if (!patient) throw new NotFoundException('Paciente no encontrado.');

    const encounter = this.encounterRepo.create({
      patientId,
      veterinarianId: vetId,
      queueEntryId,
      appointmentId,
      startTime: new Date(),
      status: EncounterStatusEnum.ACTIVA,
      generalNotes: dto.generalNotes?.trim() || null,
      createdByUserId: userId,
    });

    const saved = await this.encounterRepo.save(encounter);
    return this.findOne(saved.id);
  }

  // ── 2. Obtener Consulta ──
  async findOne(id: number): Promise<EncounterDetailResponseDto> {
    const entity = await this.encounterRepo
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.patient', 'patient')
      .leftJoinAndSelect('patient.species', 'species')
      .leftJoinAndSelect('patient.breed', 'breed')
      .leftJoinAndSelect('e.consultationReason', 'cr')
      .leftJoinAndSelect('e.anamnesis', 'an')
      .leftJoinAndSelect('e.clinicalExam', 'ce')
      .leftJoinAndSelect('e.environmentalData', 'env')
      .leftJoinAndSelect('e.clinicalImpression', 'ci')
      .leftJoinAndSelect('e.plan', 'plan')
      .where('e.id = :id', { id })
      .andWhere('e.deleted_at IS NULL')
      .getOne();

    if (!entity) throw new NotFoundException('Consulta no encontrada.');

    return this.mapToDto(entity);
  }

  // ── Helper de Mapeo ──
  private mapToDto(e: Encounter): EncounterDetailResponseDto {
    const dto = new EncounterDetailResponseDto();
    dto.id = e.id;
    dto.patientId = e.patientId;
    dto.veterinarianId = e.veterinarianId;
    dto.queueEntryId = e.queueEntryId;
    dto.appointmentId = e.appointmentId;
    dto.startTime = e.startTime.toISOString();
    dto.endTime = e.endTime ? e.endTime.toISOString() : null;
    dto.status = e.status;
    dto.generalNotes = e.generalNotes;

    const patientDto = new EncounterPatientDto();
    patientDto.id = e.patientId;
    patientDto.name = e.patient?.name ?? '';
    patientDto.species = e.patient?.species?.name ?? '';
    patientDto.breed = e.patient?.breed?.name ?? '';
    dto.patient = patientDto;

    // Tabs
    dto.consultationReason = e.consultationReason as any;
    dto.anamnesis = e.anamnesis as any;
    dto.clinicalExam = e.clinicalExam as any;
    dto.environmentalData = e.environmentalData as any;
    dto.clinicalImpression = e.clinicalImpression as any;
    dto.plan = e.plan as any;

    // Para luego cuando agreguemos POST de tratamientos
    dto.treatmentsCount = 0;
    dto.vaccinesCount = 0;
    dto.dewormingCount = 0;
    dto.surgeriesCount = 0;
    dto.proceduresCount = 0;

    return dto;
  }

  // ── 3. Finalizar Consulta ──
  async finish(id: number): Promise<EncounterDetailResponseDto> {
    const e = await this.encounterRepo.findOne({ where: { id, deletedAt: IsNull() } });
    if (!e) throw new NotFoundException('Consulta no encontrada.');
    if (e.status !== EncounterStatusEnum.ACTIVA) {
      throw new BadRequestException('Esta consulta ya no está activa.');
    }

    await this.encounterRepo.update(id, {
      status: EncounterStatusEnum.FINALIZADA,
      endTime: new Date(),
    });

    if (e.queueEntryId) {
      await this.queueRepo.update(e.queueEntryId, { status: QueueStatusEnum.FINALIZADA });
    }

    return this.findOne(id);
  }

  // ── 4. Actualizar Pestañas (Motivo, Anamnesis, Examen, etc.) ──
  async updateReason(id: number, dto: UpdateEncounterReasonDto): Promise<void> {
    const r = await this.reasonRepo.findOne({ where: { encounterId: id } });
    if (r) await this.reasonRepo.update({ encounterId: id }, dto);
    else await this.reasonRepo.save(this.reasonRepo.create({ encounterId: id, ...dto }));
  }

  async updateAnamnesis(id: number, dto: UpdateEncounterAnamnesisDto): Promise<void> {
    const r = await this.anamnesisRepo.findOne({ where: { encounterId: id } });
    if (r) await this.anamnesisRepo.update({ encounterId: id }, dto);
    else await this.anamnesisRepo.save(this.anamnesisRepo.create({ encounterId: id, ...dto }));
  }

  async updateClinicalExam(id: number, dto: UpdateEncounterClinicalExamDto): Promise<void> {
    const r = await this.examRepo.findOne({ where: { encounterId: id } });
    if (r) await this.examRepo.update({ encounterId: id }, dto);
    else await this.examRepo.save(this.examRepo.create({ encounterId: id, ...dto }));
  }

  async updateEnvironmentalData(id: number, dto: UpdateEncounterEnvironmentalDataDto): Promise<void> {
    const r = await this.envRepo.findOne({ where: { encounterId: id } });
    if (r) await this.envRepo.update({ encounterId: id }, dto);
    else await this.envRepo.save(this.envRepo.create({ encounterId: id, ...dto }));
  }

  async updateImpression(id: number, dto: UpdateEncounterClinicalImpressionDto): Promise<void> {
    const r = await this.impressionRepo.findOne({ where: { encounterId: id } });
    if (r) await this.impressionRepo.update({ encounterId: id }, dto);
    else await this.impressionRepo.save(this.impressionRepo.create({ encounterId: id, ...dto }));
  }

  async updatePlan(id: number, dto: UpdateEncounterPlanDto): Promise<void> {
    const r = await this.planRepo.findOne({ where: { encounterId: id } });
    if (r) await this.planRepo.update({ encounterId: id }, dto);
    else await this.planRepo.save(this.planRepo.create({ encounterId: id, ...dto }));
  }
}
