import { Entity, Column, OneToOne } from 'typeorm';
import { BaseAuditEntity } from '../../common/entities/base-audit.entity.js';
import { GenderEnum, PersonTypeEnum } from '../../common/enums/index.js';

@Entity({ name: 'personas' })
export class Persona extends BaseAuditEntity {
  @Column({
    name: 'tipo_persona',
    type: 'enum',
    enum: PersonTypeEnum,
    enumName: 'person_type_enum',
  })
  tipoPersona!: PersonTypeEnum;

  @Column({ type: 'varchar', length: 120 })
  nombres!: string;

  @Column({ type: 'varchar', length: 120 })
  apellidos!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  cedula!: string | null;

  @Column({ type: 'varchar', length: 25, nullable: true })
  telefono!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  direccion!: string | null;

  @Column({
    type: 'enum',
    enum: GenderEnum,
    enumName: 'gender_enum',
    nullable: true,
  })
  genero!: GenderEnum | null;

  @Column({
    name: 'fecha_nacimiento',
    type: 'date',
    nullable: true,
  })
  fechaNacimiento!: Date | null;
}
