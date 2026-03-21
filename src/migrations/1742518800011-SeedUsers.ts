import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Seeds initial users:
 * 1. Admin (persona + usuario + empleado + ADMIN role)
 * 2. Test client (persona + usuario + cliente + CLIENTE_APP role)
 *
 * Passwords are hashed with pgcrypto's crypt() which produces bcrypt hashes
 * compatible with Node's bcrypt library.
 *
 *   Admin:   admin@safepet.com  / Admin123!
 *   Cliente: cliente@safepet.com / Cliente123!
 */
export class SeedUsers1742518800011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── 1. Admin user ──────────────────────────────────
    await queryRunner.query(`
      DO $$
      DECLARE
        v_persona_id UUID;
        v_usuario_id UUID;
        v_rol_id     UUID;
      BEGIN
        -- Persona
        INSERT INTO personas (tipo_persona, nombres, apellidos, cedula, telefono, activo)
        VALUES ('EMPLEADO', 'Admin', 'SafePet', '0000000001', '0000000000', true)
        RETURNING id INTO v_persona_id;

        -- Usuario (password: Admin123!)
        INSERT INTO usuarios (persona_id, correo, password_hash, activo)
        VALUES (
          v_persona_id,
          'admin@safepet.com',
          crypt('Admin123!', gen_salt('bf', 10)),
          true
        )
        RETURNING id INTO v_usuario_id;

        -- Empleado
        INSERT INTO empleados (persona_id, codigo, cargo, es_mvz, activo)
        VALUES (v_persona_id, 'EMP-001', 'Administrador', false, true);

        -- Assign ADMIN role
        SELECT id INTO v_rol_id FROM roles WHERE nombre = 'ADMIN' AND deleted_at IS NULL;
        IF v_rol_id IS NOT NULL THEN
          INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (v_usuario_id, v_rol_id);
        END IF;
      END $$
    `);

    // ── 2. Test client user ────────────────────────────
    await queryRunner.query(`
      DO $$
      DECLARE
        v_persona_id UUID;
        v_usuario_id UUID;
        v_rol_id     UUID;
      BEGIN
        -- Persona
        INSERT INTO personas (tipo_persona, nombres, apellidos, cedula, telefono, activo)
        VALUES ('CLIENTE', 'Cliente', 'De Prueba', '0000000002', '0000000001', true)
        RETURNING id INTO v_persona_id;

        -- Usuario (password: Cliente123!)
        INSERT INTO usuarios (persona_id, correo, password_hash, activo)
        VALUES (
          v_persona_id,
          'cliente@safepet.com',
          crypt('Cliente123!', gen_salt('bf', 10)),
          true
        )
        RETURNING id INTO v_usuario_id;

        -- Cliente
        INSERT INTO clientes (persona_id, observaciones, activo)
        VALUES (v_persona_id, 'Usuario de prueba', true);

        -- Assign CLIENTE_APP role
        SELECT id INTO v_rol_id FROM roles WHERE nombre = 'CLIENTE_APP' AND deleted_at IS NULL;
        IF v_rol_id IS NOT NULL THEN
          INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (v_usuario_id, v_rol_id);
        END IF;
      END $$
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete in reverse dependency order
    await queryRunner.query(`
      DELETE FROM usuarios_roles
      WHERE usuario_id IN (
        SELECT u.id FROM usuarios u WHERE u.correo IN ('admin@safepet.com', 'cliente@safepet.com')
      )
    `);
    await queryRunner.query(`DELETE FROM empleados WHERE persona_id IN (SELECT id FROM personas WHERE cedula = '0000000001')`);
    await queryRunner.query(`DELETE FROM clientes WHERE persona_id IN (SELECT id FROM personas WHERE cedula = '0000000002')`);
    await queryRunner.query(`DELETE FROM usuarios WHERE correo IN ('admin@safepet.com', 'cliente@safepet.com')`);
    await queryRunner.query(`DELETE FROM personas WHERE cedula IN ('0000000001', '0000000002')`);
  }
}
