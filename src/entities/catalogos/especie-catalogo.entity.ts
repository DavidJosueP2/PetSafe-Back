import { Entity, Column, OneToMany } from 'typeorm';
import { BaseAuditEntity } from '../../common/entities/base-audit.entity.js';
import { RazaCatalogo } from './raza-catalogo.entity.js';

@Entity({ name: 'especies_catalogo' })
export class EspecieCatalogo extends BaseAuditEntity {
  @Column({ type: 'varchar', length: 80 })
  nombre!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion!: string | null;

  @OneToMany(() => RazaCatalogo, (r) => r.especie)
  razas!: RazaCatalogo[];
}
