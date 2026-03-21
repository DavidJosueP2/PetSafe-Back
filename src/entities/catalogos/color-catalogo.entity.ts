import { Entity, Column } from 'typeorm';
import { BaseAuditEntity } from '../../common/entities/base-audit.entity.js';

@Entity({ name: 'colores_catalogo' })
export class ColorCatalogo extends BaseAuditEntity {
  @Column({ type: 'varchar', length: 80 })
  nombre!: string;
}
