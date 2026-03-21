import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersAndAuth1742518800001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre varchar(80) NOT NULL,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS personas (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        tipo_persona person_type_enum NOT NULL,
        nombres varchar(120) NOT NULL,
        apellidos varchar(120) NOT NULL,
        cedula varchar(20),
        telefono varchar(25),
        direccion varchar(255),
        genero gender_enum,
        fecha_nacimiento date,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        persona_id uuid NOT NULL,
        correo citext NOT NULL,
        password_hash varchar(255) NOT NULL,
        ultimo_login_at timestamp without time zone,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        CONSTRAINT fk_usuarios_persona FOREIGN KEY (persona_id) REFERENCES personas(id) ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS empleados (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        persona_id uuid NOT NULL,
        codigo varchar(40),
        cargo varchar(120),
        numero_registro_profesional varchar(80),
        es_mvz boolean NOT NULL DEFAULT false,
        fecha_ingreso date,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        CONSTRAINT fk_empleados_persona FOREIGN KEY (persona_id) REFERENCES personas(id) ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        persona_id uuid NOT NULL,
        observaciones text,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        CONSTRAINT fk_clientes_persona FOREIGN KEY (persona_id) REFERENCES personas(id) ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS usuarios_roles (
        usuario_id uuid NOT NULL,
        rol_id uuid NOT NULL,
        assigned_at timestamp without time zone NOT NULL DEFAULT now(),
        PRIMARY KEY (usuario_id, rol_id),
        CONSTRAINT fk_usuarios_roles_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        CONSTRAINT fk_usuarios_roles_rol FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS usuarios_refresh_tokens (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        usuario_id uuid NOT NULL,
        token_hash varchar(255) NOT NULL,
        expires_at timestamp without time zone NOT NULL,
        revoked boolean NOT NULL DEFAULT false,
        revoked_at timestamp without time zone,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        CONSTRAINT fk_refresh_tokens_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS usuarios_refresh_tokens CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS usuarios_roles CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS clientes CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS empleados CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS usuarios CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS personas CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS roles CASCADE`);
  }
}
