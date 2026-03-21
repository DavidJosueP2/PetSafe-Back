import { MigrationInterface, QueryRunner } from 'typeorm';

export class Scheduling1742518800004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS citas (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        paciente_id uuid NOT NULL,
        mvz_id uuid NOT NULL,
        fecha_programada date NOT NULL,
        hora_programada time without time zone NOT NULL,
        motivo_programada appointment_reason_enum NOT NULL,
        notas text,
        estado_cita appointment_status_enum NOT NULL DEFAULT 'PROGRAMADA',
        created_by_usuario_id uuid,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        CONSTRAINT fk_citas_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE RESTRICT,
        CONSTRAINT fk_citas_mvz FOREIGN KEY (mvz_id) REFERENCES empleados(id) ON DELETE RESTRICT,
        CONSTRAINT fk_citas_created_by_usuario FOREIGN KEY (created_by_usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cola_atenciones (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        fecha date NOT NULL,
        cita_id uuid,
        paciente_id uuid NOT NULL,
        mvz_id uuid NOT NULL,
        tipo_ingreso queue_entry_type_enum NOT NULL,
        hora_llegada timestamp without time zone NOT NULL,
        hora_programada time without time zone,
        estado queue_status_enum NOT NULL DEFAULT 'EN_ESPERA',
        observaciones text,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        CONSTRAINT fk_cola_atenciones_cita FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE SET NULL,
        CONSTRAINT fk_cola_atenciones_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE RESTRICT,
        CONSTRAINT fk_cola_atenciones_mvz FOREIGN KEY (mvz_id) REFERENCES empleados(id) ON DELETE RESTRICT
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS cola_atenciones CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS citas CASCADE`);
  }
}
