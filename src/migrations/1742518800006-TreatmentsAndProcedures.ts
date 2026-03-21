import { MigrationInterface, QueryRunner } from 'typeorm';

export class TreatmentsAndProcedures1742518800006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS tratamientos (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        atencion_id uuid NOT NULL,
        estado treatment_status_enum NOT NULL DEFAULT 'ACTIVO',
        fecha_inicio date NOT NULL,
        fecha_fin date,
        indicaciones_generales text,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        CONSTRAINT ck_tratamientos_fechas CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio),
        CONSTRAINT fk_tratamientos_atencion FOREIGN KEY (atencion_id) REFERENCES atenciones(id) ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS tratamientos_item (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        tratamiento_id uuid NOT NULL,
        medicamento varchar(120) NOT NULL,
        dosis varchar(120) NOT NULL,
        frecuencia varchar(120) NOT NULL,
        duracion_dias integer NOT NULL,
        via_administracion varchar(120) NOT NULL,
        observaciones text,
        estado treatment_item_status_enum NOT NULL DEFAULT 'ACTIVO',
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        CONSTRAINT ck_tratamientos_item_duracion CHECK (duracion_dias > 0),
        CONSTRAINT fk_tratamientos_item_tratamiento FOREIGN KEY (tratamiento_id) REFERENCES tratamientos(id) ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS vacunaciones_evento (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        atencion_id uuid NOT NULL,
        vacuna_id uuid NOT NULL,
        fecha_aplicacion date NOT NULL,
        proxima_fecha_sugerida date,
        observaciones text,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        CONSTRAINT fk_vacunaciones_evento_atencion FOREIGN KEY (atencion_id) REFERENCES atenciones(id) ON DELETE CASCADE,
        CONSTRAINT fk_vacunaciones_evento_vacuna FOREIGN KEY (vacuna_id) REFERENCES vacunas_catalogo(id) ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS desparasitaciones_evento (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        atencion_id uuid NOT NULL,
        producto_id uuid NOT NULL,
        fecha_aplicacion date NOT NULL,
        proxima_fecha_sugerida date,
        observaciones text,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        CONSTRAINT fk_desparasitaciones_evento_atencion FOREIGN KEY (atencion_id) REFERENCES atenciones(id) ON DELETE CASCADE,
        CONSTRAINT fk_desparasitaciones_evento_producto FOREIGN KEY (producto_id) REFERENCES catalogo_antiparasitarios(id) ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cirugias (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        atencion_id uuid NOT NULL,
        tipo_cirugia varchar(120) NOT NULL,
        fecha_programada timestamp without time zone,
        fecha_realizada timestamp without time zone,
        estado_cirugia surgery_status_enum NOT NULL DEFAULT 'PROGRAMADA',
        descripcion text,
        indicaciones_postoperatorias text,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        CONSTRAINT ck_cirugias_fechas CHECK (
          fecha_programada IS NULL OR fecha_realizada IS NULL OR fecha_realizada >= fecha_programada
        ),
        CONSTRAINT fk_cirugias_atencion FOREIGN KEY (atencion_id) REFERENCES atenciones(id) ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS procedimientos (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        atencion_id uuid NOT NULL,
        tipo_procedimiento varchar(120) NOT NULL,
        fecha_realizacion timestamp without time zone NOT NULL,
        descripcion text,
        resultado text,
        observaciones text,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        CONSTRAINT fk_procedimientos_atencion FOREIGN KEY (atencion_id) REFERENCES atenciones(id) ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS procedimientos CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS cirugias CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS desparasitaciones_evento CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS vacunaciones_evento CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS tratamientos_item CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS tratamientos CASCADE`);
  }
}
