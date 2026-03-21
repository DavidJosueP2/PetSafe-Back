import { MigrationInterface, QueryRunner } from 'typeorm';

export class Encounters1742518800005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS atenciones (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        cita_id uuid,
        cola_atencion_id uuid,
        paciente_id uuid NOT NULL,
        mvz_id uuid NOT NULL,
        fecha_hora_inicio timestamp without time zone NOT NULL,
        fecha_hora_fin timestamp without time zone,
        estado encounter_status_enum NOT NULL DEFAULT 'ACTIVA',
        observaciones_generales text,
        created_by_usuario_id uuid,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        CONSTRAINT ck_atenciones_fechas CHECK (fecha_hora_fin IS NULL OR fecha_hora_fin >= fecha_hora_inicio),
        CONSTRAINT ck_atenciones_estado_fin CHECK (
          (estado = 'ACTIVA' AND fecha_hora_fin IS NULL) OR
          (estado IN ('FINALIZADA', 'ANULADA'))
        ),
        CONSTRAINT fk_atenciones_cita FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE SET NULL,
        CONSTRAINT fk_atenciones_cola FOREIGN KEY (cola_atencion_id) REFERENCES cola_atenciones(id) ON DELETE SET NULL,
        CONSTRAINT fk_atenciones_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE RESTRICT,
        CONSTRAINT fk_atenciones_mvz FOREIGN KEY (mvz_id) REFERENCES empleados(id) ON DELETE RESTRICT,
        CONSTRAINT fk_atenciones_created_by_usuario FOREIGN KEY (created_by_usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS atenciones_motivo_consulta (
        atencion_id uuid PRIMARY KEY,
        motivo_consulta text NOT NULL,
        antecedente_enfermedad_actual text,
        diagnosticos_anteriores_referidos text,
        tratamientos_anteriores_referidos text,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        CONSTRAINT fk_atenciones_motivo_consulta_atencion FOREIGN KEY (atencion_id) REFERENCES atenciones(id) ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS atenciones_anamnesis (
        atencion_id uuid PRIMARY KEY,
        inicio_problema_texto text,
        cirugias_previas_texto text,
        como_empezo_problema_texto text,
        vacunas_al_dia boolean,
        desparasitaciones_al_dia boolean,
        hay_mascota_en_casa boolean,
        mascota_en_casa_detalle text,
        medicamento_administrado_texto text,
        come_estado appetite_status_enum,
        toma_agua_estado water_intake_status_enum,
        heces_texto text,
        vomito_texto text,
        numero_deposiciones integer,
        orina_texto text,
        problemas_respiratorios_texto text,
        dificultad_caminar_texto text,
        observaciones text,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        CONSTRAINT ck_atenciones_anamnesis_numero_deposiciones CHECK (numero_deposiciones IS NULL OR numero_deposiciones >= 0),
        CONSTRAINT fk_atenciones_anamnesis_atencion FOREIGN KEY (atencion_id) REFERENCES atenciones(id) ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS atenciones_examen_clinico (
        atencion_id uuid PRIMARY KEY,
        peso_kg numeric(8,2),
        temperatura_c numeric(5,2),
        pulso integer,
        frecuencia_cardiaca integer,
        frecuencia_respiratoria integer,
        mucosas mucosa_status_enum,
        ganglios_linfaticos varchar(120),
        hidratacion hydration_status_enum,
        tllc_segundos integer,
        observaciones_examen text,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        CONSTRAINT ck_atenciones_examen_peso CHECK (peso_kg IS NULL OR peso_kg > 0),
        CONSTRAINT ck_atenciones_examen_temperatura CHECK (temperatura_c IS NULL OR (temperatura_c >= 20 AND temperatura_c <= 50)),
        CONSTRAINT ck_atenciones_examen_pulso CHECK (pulso IS NULL OR pulso >= 0),
        CONSTRAINT ck_atenciones_examen_fc CHECK (frecuencia_cardiaca IS NULL OR frecuencia_cardiaca >= 0),
        CONSTRAINT ck_atenciones_examen_fr CHECK (frecuencia_respiratoria IS NULL OR frecuencia_respiratoria >= 0),
        CONSTRAINT ck_atenciones_examen_tllc CHECK (tllc_segundos IS NULL OR tllc_segundos >= 0),
        CONSTRAINT fk_atenciones_examen_atencion FOREIGN KEY (atencion_id) REFERENCES atenciones(id) ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS atenciones_datos_medioambientales (
        atencion_id uuid PRIMARY KEY,
        entorno_texto text,
        nutricion_texto text,
        estilo_vida_texto text,
        tipo_alimentacion_texto text,
        observaciones text,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        CONSTRAINT fk_atenciones_datos_medioambientales_atencion FOREIGN KEY (atencion_id) REFERENCES atenciones(id) ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS atenciones_impresion_clinica (
        atencion_id uuid PRIMARY KEY,
        diagnostico_presuntivo text,
        diagnostico_diferencial text,
        pronostico text,
        observaciones_clinicas text,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        CONSTRAINT fk_atenciones_impresion_clinica_atencion FOREIGN KEY (atencion_id) REFERENCES atenciones(id) ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS atenciones_plan (
        atencion_id uuid PRIMARY KEY,
        plan_clinico text,
        requiere_proxima_cita boolean NOT NULL DEFAULT false,
        fecha_sugerida_proxima_cita date,
        observaciones_plan text,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        CONSTRAINT ck_atenciones_plan_proxima_cita CHECK (
          (requiere_proxima_cita = false) OR
          (requiere_proxima_cita = true AND fecha_sugerida_proxima_cita IS NOT NULL)
        ),
        CONSTRAINT fk_atenciones_plan_atencion FOREIGN KEY (atencion_id) REFERENCES atenciones(id) ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS atenciones_plan CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS atenciones_impresion_clinica CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS atenciones_datos_medioambientales CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS atenciones_examen_clinico CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS atenciones_anamnesis CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS atenciones_motivo_consulta CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS atenciones CASCADE`);
  }
}
