import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Paciente } from '../../entities/pacientes/paciente.entity.js';
import { PacienteTutor } from '../../entities/pacientes/paciente-tutor.entity.js';
import { Cliente } from '../../entities/personas/cliente.entity.js';
import { CreatePacienteDto } from '../../dto/pacientes/create-paciente.dto.js';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepo: Repository<Paciente>,
    @InjectRepository(PacienteTutor)
    private readonly pacienteTutorRepo: Repository<PacienteTutor>,
    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreatePacienteDto, userId: string) {
    return this.dataSource.transaction(async (manager) => {
      // Find client profile with pessimistic lock to prevent concurrent inserts
      const cliente = await manager
        .createQueryBuilder(Cliente, 'c')
        .setLock('pessimistic_read')
        .innerJoin('personas', 'p', 'p.id = c.persona_id')
        .innerJoin('usuarios', 'u', 'u.persona_id = p.id')
        .where('u.id = :userId', { userId })
        .andWhere('c.deleted_at IS NULL')
        .getOne();

      if (!cliente) {
        throw new NotFoundException(
          'No se encontró perfil de cliente para este usuario',
        );
      }

      // 1. Create paciente
      const paciente = manager.create(Paciente, {
        nombre: dto.nombre,
        especieId: dto.especieId,
        sexo: dto.sexo,
        razaId: dto.razaId ?? null,
        colorId: dto.colorId ?? null,
        fechaNacimiento: dto.fechaNacimiento
          ? new Date(dto.fechaNacimiento)
          : null,
        pesoActual: dto.pesoActual ?? null,
        esterilizado: dto.esterilizado ?? false,
        microchipCodigo: dto.microchipCodigo ?? null,
        senasParticulares: dto.senasParticulares ?? null,
        alergiasGenerales: dto.alergiasGenerales ?? null,
        antecedentesGenerales: dto.antecedentesGenerales ?? null,
      });
      const savedPaciente = await manager.save(Paciente, paciente);

      // 2. Link as primary tutor
      const tutor = manager.create(PacienteTutor, {
        pacienteId: savedPaciente.id,
        clienteId: cliente.id,
        esPrincipal: true,
        parentescoORelacion: 'Dueño',
      });
      await manager.save(PacienteTutor, tutor);

      // 3. Fetch full entity with relations for response
      return this.findOneInternal(savedPaciente.id, userId, manager);
    });
  }

  async findAllByUser(userId: string) {
    const pacientes = await this.pacienteRepo
      .createQueryBuilder('p')
      .innerJoin('pacientes_tutores', 'pt', 'pt.paciente_id = p.id AND pt.deleted_at IS NULL')
      .innerJoin('clientes', 'c', 'c.id = pt.cliente_id AND c.deleted_at IS NULL')
      .innerJoin('personas', 'per', 'per.id = c.persona_id')
      .innerJoin('usuarios', 'u', 'u.persona_id = per.id AND u.deleted_at IS NULL')
      .leftJoinAndSelect('p.especie', 'especie')
      .leftJoinAndSelect('p.raza', 'raza')
      .leftJoinAndSelect('p.color', 'color')
      .where('u.id = :userId', { userId })
      .andWhere('p.deleted_at IS NULL')
      .orderBy('p.nombre', 'ASC')
      .getMany();

    return pacientes.map((p) => this.toResponse(p));
  }

  async findOne(pacienteId: string, userId: string) {
    return this.findOneInternal(pacienteId, userId);
  }

  private async findOneInternal(
    pacienteId: string,
    userId: string,
    manager?: any,
  ) {
    const repo = manager
      ? manager.getRepository(Paciente)
      : this.pacienteRepo;

    const paciente = await repo
      .createQueryBuilder('p')
      .innerJoin('pacientes_tutores', 'pt', 'pt.paciente_id = p.id AND pt.deleted_at IS NULL')
      .innerJoin('clientes', 'c', 'c.id = pt.cliente_id AND c.deleted_at IS NULL')
      .innerJoin('personas', 'per', 'per.id = c.persona_id')
      .innerJoin('usuarios', 'u', 'u.persona_id = per.id AND u.deleted_at IS NULL')
      .leftJoinAndSelect('p.especie', 'especie')
      .leftJoinAndSelect('p.raza', 'raza')
      .leftJoinAndSelect('p.color', 'color')
      .leftJoinAndSelect('p.condiciones', 'condiciones', 'condiciones.deleted_at IS NULL')
      .where('p.id = :pacienteId', { pacienteId })
      .andWhere('u.id = :userId', { userId })
      .andWhere('p.deleted_at IS NULL')
      .getOne();

    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }

    return this.toResponse(paciente);
  }

  private toResponse(p: Paciente) {
    return {
      id: p.id,
      codigo: p.codigo,
      nombre: p.nombre,
      sexo: p.sexo,
      fechaNacimiento: p.fechaNacimiento,
      pesoActual: p.pesoActual,
      esterilizado: p.esterilizado,
      microchipCodigo: p.microchipCodigo,
      senasParticulares: p.senasParticulares,
      alergiasGenerales: p.alergiasGenerales,
      antecedentesGenerales: p.antecedentesGenerales,
      especie: p.especie
        ? { id: p.especie.id, nombre: p.especie.nombre }
        : null,
      raza: p.raza ? { id: p.raza.id, nombre: p.raza.nombre } : null,
      color: p.color ? { id: p.color.id, nombre: p.color.nombre } : null,
      condiciones:
        p.condiciones?.map((c) => ({
          id: c.id,
          tipo: c.tipo,
          nombre: c.nombre,
          descripcion: c.descripcion,
          activa: c.activa,
        })) ?? [],
    };
  }
}
