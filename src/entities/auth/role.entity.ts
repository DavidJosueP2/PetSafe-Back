import { Entity, Column, OneToMany } from 'typeorm';
import { BaseAuditEntity } from '../../common/entities/base-audit.entity.js';
import type { UsuarioRol } from './usuario-rol.entity.js';

@Entity({ name: 'roles' })
export class Role extends BaseAuditEntity {
  @Column({ type: 'varchar', length: 80 })
  nombre!: string;

  @OneToMany('UsuarioRol', 'rol')
  usuariosRoles!: UsuarioRol[];
}
