import { MigrationInterface, QueryRunner } from 'typeorm';

export class Media1742518800007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS archivos_media (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        owner_type media_owner_type_enum NOT NULL,
        owner_id uuid NOT NULL,
        tipo_media media_type_enum NOT NULL,
        provider storage_provider_enum NOT NULL,
        url text NOT NULL,
        key_storage varchar(255),
        nombre_original varchar(255) NOT NULL,
        mime_type varchar(120),
        size_bytes bigint,
        ancho integer,
        alto integer,
        metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
        created_by_usuario_id uuid,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        CONSTRAINT ck_archivos_media_size CHECK (size_bytes IS NULL OR size_bytes >= 0),
        CONSTRAINT ck_archivos_media_ancho CHECK (ancho IS NULL OR ancho >= 0),
        CONSTRAINT ck_archivos_media_alto CHECK (alto IS NULL OR alto >= 0),
        CONSTRAINT fk_archivos_media_created_by FOREIGN KEY (created_by_usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS archivos_media CASCADE`);
  }
}
