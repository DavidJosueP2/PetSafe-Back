import { Entity, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { BaseAuditEntity } from '../../common/entities/base-audit.entity.js';
import { EncounterStatusEnum } from '../../common/enums/index.js';
import { Cita } from '../citas/cita.entity.js';
import { ColaAtencion } from '../citas/cola-atencion.entity.js';
import { Paciente } from '../pacientes/paciente.entity.js';
import { Empleado } from '../personas/empleado.entity.js';
import { Usuario } from '../auth/usuario.entity.js';
import { AtencionMotivoConsulta } from './atencion-motivo-consulta.entity.js';
import { AtencionAnamnesis } from './atencion-anamnesis.entity.js';
import { AtencionExamenClinico } from './atencion-examen-clinico.entity.js';
import { AtencionDatosMedioambientales } from './atencion-datos-medioambientales.entity.js';
import { AtencionImpresionClinica } from './atencion-impresion-clinica.entity.js';
import { AtencionPlan } from './atencion-plan.entity.js';
import { Tratamiento } from './tratamiento.entity.js';
import { VacunacionEvento } from './vacunacion-evento.entity.js';
import { DesparasitacionEvento } from './desparasitacion-evento.entity.js';
import { Cirugia } from './cirugia.entity.js';
import { Procedimiento } from './procedimiento.entity.js';

@Entity({ name: 'atenciones' })
export class Atencion extends BaseAuditEntity {
  @Column({ name: 'cita_id', type: 'uuid', nullable: true })
  citaId!: string | null;

  @ManyToOne(() => Cita, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'cita_id' })
  cita!: Cita | null;

  @Column({ name: 'cola_atencion_id', type: 'uuid', nullable: true })
  colaAtencionId!: string | null;

  @ManyToOne(() => ColaAtencion, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'cola_atencion_id' })
  colaAtencion!: ColaAtencion | null;

  @Column({ name: 'paciente_id', type: 'uuid' })
  pacienteId!: string;

  @ManyToOne(() => Paciente, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'paciente_id' })
  paciente!: Paciente;

  @Column({ name: 'mvz_id', type: 'uuid' })
  mvzId!: string;

  @ManyToOne(() => Empleado, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'mvz_id' })
  mvz!: Empleado;

  @Column({ name: 'fecha_hora_inicio', type: 'timestamp without time zone' })
  fechaHoraInicio!: Date;

  @Column({ name: 'fecha_hora_fin', type: 'timestamp without time zone', nullable: true })
  fechaHoraFin!: Date | null;

  @Column({
    type: 'enum',
    enum: EncounterStatusEnum,
    enumName: 'encounter_status_enum',
    default: EncounterStatusEnum.ACTIVA,
  })
  estado!: EncounterStatusEnum;

  @Column({ name: 'observaciones_generales', type: 'text', nullable: true })
  observacionesGenerales!: string | null;

  @Column({ name: 'created_by_usuario_id', type: 'uuid', nullable: true })
  createdByUsuarioId!: string | null;

  @ManyToOne(() => Usuario, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by_usuario_id' })
  createdByUsuario!: Usuario | null;

  // ── Detail sub-entities (1:1) ──
  @OneToOne(() => AtencionMotivoConsulta, (m) => m.atencion, { cascade: true })
  motivoConsulta!: AtencionMotivoConsulta | null;

  @OneToOne(() => AtencionAnamnesis, (a) => a.atencion, { cascade: true })
  anamnesis!: AtencionAnamnesis | null;

  @OneToOne(() => AtencionExamenClinico, (e) => e.atencion, { cascade: true })
  examenClinico!: AtencionExamenClinico | null;

  @OneToOne(() => AtencionDatosMedioambientales, (d) => d.atencion, { cascade: true })
  datosMedioambientales!: AtencionDatosMedioambientales | null;

  @OneToOne(() => AtencionImpresionClinica, (i) => i.atencion, { cascade: true })
  impresionClinica!: AtencionImpresionClinica | null;

  @OneToOne(() => AtencionPlan, (p) => p.atencion, { cascade: true })
  plan!: AtencionPlan | null;

  // ── Detail sub-entities (1:N) ──
  @OneToMany(() => Tratamiento, (t) => t.atencion, { cascade: true })
  tratamientos!: Tratamiento[];

  @OneToMany(() => VacunacionEvento, (v) => v.atencion, { cascade: true })
  vacunaciones!: VacunacionEvento[];

  @OneToMany(() => DesparasitacionEvento, (d) => d.atencion, { cascade: true })
  desparasitaciones!: DesparasitacionEvento[];

  @OneToMany(() => Cirugia, (c) => c.atencion, { cascade: true })
  cirugias!: Cirugia[];

  @OneToMany(() => Procedimiento, (p) => p.atencion, { cascade: true })
  procedimientos!: Procedimiento[];
}
