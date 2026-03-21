import { MigrationInterface, QueryRunner } from 'typeorm';

export class Catalogs1742518800002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS especies_catalogo (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre varchar(80) NOT NULL,
        descripcion varchar(255),
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS razas_catalogo (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        especie_id uuid NOT NULL,
        nombre varchar(100) NOT NULL,
        descripcion varchar(255),
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        CONSTRAINT fk_razas_especie FOREIGN KEY (especie_id) REFERENCES especies_catalogo(id) ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS colores_catalogo (
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
      CREATE TABLE IF NOT EXISTS vacunas_catalogo (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre varchar(120) NOT NULL,
        especie vaccine_species_enum NOT NULL,
        es_revacunacion boolean NOT NULL DEFAULT false,
        activa boolean NOT NULL DEFAULT true,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS catalogo_antiparasitarios (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre varchar(120) NOT NULL,
        tipo antiparasitic_type_enum NOT NULL,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS catalogo_antiparasitarios CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS vacunas_catalogo CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS colores_catalogo CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS razas_catalogo CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS especies_catalogo CASCADE`);
  }
}
