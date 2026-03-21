import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseAuditEntity } from '../../common/entities/base-audit.entity.js';
import { TreatmentStatusEnum } from '../../common/enums/index.js';
import { Atencion } from './atencion.entity.js';
import { TratamientoItem } from './tratamiento-item.entity.js';

@Entity({ name: 'tratamientos' })
export class Tratamiento extends BaseAuditEntity {
  @Column({ name: 'atencion_id', type: 'uuid' })
  atencionId!: string;

  @ManyToOne(() => Atencion, (a) => a.tratamientos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'atencion_id' })
  atencion!: Atencion;

  @Column({
    type: 'enum',
    enum: TreatmentStatusEnum,
    enumName: 'treatment_status_enum',
    default: TreatmentStatusEnum.ACTIVO,
  })
  estado!: TreatmentStatusEnum;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio!: Date;

  @Column({ name: 'fecha_fin', type: 'date', nullable: true })
  fechaFin!: Date | null;

  @Column({ name: 'indicaciones_generales', type: 'text', nullable: true })
  indicacionesGenerales!: string | null;

  @OneToMany(() => TratamientoItem, (ti) => ti.tratamiento, { cascade: true })
  items!: TratamientoItem[];
}
