import { Entity, Column } from 'typeorm';
import { BaseAuditEntity } from '../../common/entities/base-audit.entity.js';
import { AntiparasiticTypeEnum } from '../../common/enums/index.js';

@Entity({ name: 'catalogo_antiparasitarios' })
export class AntiparasitarioCatalogo extends BaseAuditEntity {
  @Column({ type: 'varchar', length: 120 })
  nombre!: string;

  @Column({
    type: 'enum',
    enum: AntiparasiticTypeEnum,
    enumName: 'antiparasitic_type_enum',
  })
  tipo!: AntiparasiticTypeEnum;
}
