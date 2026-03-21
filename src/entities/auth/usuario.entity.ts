import { Entity, Column, OneToOne, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseAuditEntity } from '../../common/entities/base-audit.entity.js';
import { Persona } from '../personas/persona.entity.js';
import { UsuarioRol } from './usuario-rol.entity.js';
import { UsuarioRefreshToken } from './usuario-refresh-token.entity.js';

@Entity({ name: 'usuarios' })
export class Usuario extends BaseAuditEntity {
  @Column({ name: 'persona_id', type: 'uuid' })
  personaId!: string;

  @ManyToOne(() => Persona, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'persona_id' })
  persona!: Persona;

  @Column({ type: 'citext' })
  correo!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({
    name: 'ultimo_login_at',
    type: 'timestamp without time zone',
    nullable: true,
  })
  ultimoLoginAt!: Date | null;

  @OneToMany(() => UsuarioRol, (ur) => ur.usuario)
  usuariosRoles!: UsuarioRol[];

  @OneToMany(() => UsuarioRefreshToken, (rt) => rt.usuario)
  refreshTokens!: UsuarioRefreshToken[];
}
