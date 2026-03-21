import { Entity, Column } from 'typeorm';
import { BaseAuditEntity } from '../../common/entities/base-audit.entity.js';
import { VaccineSpeciesEnum } from '../../common/enums/index.js';

@Entity({ name: 'vacunas_catalogo' })
export class VacunaCatalogo extends BaseAuditEntity {
  @Column({ type: 'varchar', length: 120 })
  nombre!: string;

  @Column({
    type: 'enum',
    enum: VaccineSpeciesEnum,
    enumName: 'vaccine_species_enum',
  })
  especie!: VaccineSpeciesEnum;

  @Column({ name: 'es_revacunacion', type: 'boolean', default: false })
  esRevacunacion!: boolean;

  @Column({ type: 'boolean', default: true })
  activa!: boolean;
}
