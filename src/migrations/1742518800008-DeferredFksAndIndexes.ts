import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeferredFksAndIndexes1742518800008 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── Deferred deleted_by FKs (all tables → usuarios) ──
    const deletedByFks: Array<{ table: string; constraint: string }> = [
      { table: 'roles', constraint: 'fk_roles_deleted_by' },
      { table: 'personas', constraint: 'fk_personas_deleted_by' },
      { table: 'usuarios', constraint: 'fk_usuarios_deleted_by' },
      { table: 'empleados', constraint: 'fk_empleados_deleted_by' },
      { table: 'clientes', constraint: 'fk_clientes_deleted_by' },
      { table: 'usuarios_refresh_tokens', constraint: 'fk_refresh_tokens_deleted_by' },
      { table: 'especies_catalogo', constraint: 'fk_especies_deleted_by' },
      { table: 'razas_catalogo', constraint: 'fk_razas_deleted_by' },
      { table: 'colores_catalogo', constraint: 'fk_colores_deleted_by' },
      { table: 'vacunas_catalogo', constraint: 'fk_vacunas_deleted_by' },
      { table: 'catalogo_antiparasitarios', constraint: 'fk_antiparasitarios_deleted_by' },
      { table: 'pacientes', constraint: 'fk_pacientes_deleted_by' },
      { table: 'pacientes_tutores', constraint: 'fk_pacientes_tutores_deleted_by' },
      { table: 'pacientes_condiciones', constraint: 'fk_pacientes_condiciones_deleted_by' },
      { table: 'citas', constraint: 'fk_citas_deleted_by' },
      { table: 'cola_atenciones', constraint: 'fk_cola_deleted_by' },
      { table: 'atenciones', constraint: 'fk_atenciones_deleted_by' },
      { table: 'atenciones_motivo_consulta', constraint: 'fk_atenciones_motivo_deleted_by' },
      { table: 'atenciones_anamnesis', constraint: 'fk_atenciones_anamnesis_deleted_by' },
      { table: 'atenciones_examen_clinico', constraint: 'fk_atenciones_examen_deleted_by' },
      { table: 'atenciones_datos_medioambientales', constraint: 'fk_atenciones_medio_deleted_by' },
      { table: 'atenciones_impresion_clinica', constraint: 'fk_atenciones_impresion_deleted_by' },
      { table: 'atenciones_plan', constraint: 'fk_atenciones_plan_deleted_by' },
      { table: 'tratamientos', constraint: 'fk_tratamientos_deleted_by' },
      { table: 'tratamientos_item', constraint: 'fk_tratamientos_item_deleted_by' },
      { table: 'vacunaciones_evento', constraint: 'fk_vacunaciones_deleted_by' },
      { table: 'desparasitaciones_evento', constraint: 'fk_desparasitaciones_deleted_by' },
      { table: 'cirugias', constraint: 'fk_cirugias_deleted_by' },
      { table: 'procedimientos', constraint: 'fk_procedimientos_deleted_by' },
      { table: 'archivos_media', constraint: 'fk_archivos_media_deleted_by' },
    ];

    for (const fk of deletedByFks) {
      await queryRunner.query(`
        ALTER TABLE ${fk.table}
          ADD CONSTRAINT ${fk.constraint}
          FOREIGN KEY (deleted_by_usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
      `);
    }

    // ── Unique Indexes (partial / conditional) ──
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_roles_nombre_live ON roles(nombre) WHERE deleted_at IS NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_personas_cedula_live ON personas(cedula) WHERE cedula IS NOT NULL AND deleted_at IS NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_usuarios_persona_live ON usuarios(persona_id) WHERE deleted_at IS NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_usuarios_correo_live ON usuarios(correo) WHERE deleted_at IS NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_empleados_persona_live ON empleados(persona_id) WHERE deleted_at IS NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_empleados_codigo_live ON empleados(codigo) WHERE codigo IS NOT NULL AND deleted_at IS NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_clientes_persona_live ON clientes(persona_id) WHERE deleted_at IS NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_especies_nombre_live ON especies_catalogo(nombre) WHERE deleted_at IS NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_razas_especie_nombre_live ON razas_catalogo(especie_id, nombre) WHERE deleted_at IS NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_colores_nombre_live ON colores_catalogo(nombre) WHERE deleted_at IS NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_vacunas_nombre_live ON vacunas_catalogo(nombre) WHERE deleted_at IS NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_antiparasitarios_nombre_live ON catalogo_antiparasitarios(nombre) WHERE deleted_at IS NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_pacientes_codigo_live ON pacientes(codigo) WHERE codigo IS NOT NULL AND deleted_at IS NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_pacientes_microchip_live ON pacientes(microchip_codigo) WHERE microchip_codigo IS NOT NULL AND deleted_at IS NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_pacientes_tutor_principal_live ON pacientes_tutores(paciente_id) WHERE es_principal = true AND deleted_at IS NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_citas_mvz_slot_activo_live ON citas(mvz_id, fecha_programada, hora_programada) WHERE deleted_at IS NULL AND estado_cita IN ('PROGRAMADA', 'CONFIRMADA', 'EN_PROCESO')`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_cola_atenciones_cita_live ON cola_atenciones(cita_id) WHERE cita_id IS NOT NULL AND deleted_at IS NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_atencion_activa_por_paciente_live ON atenciones(paciente_id) WHERE deleted_at IS NULL AND estado = 'ACTIVA'`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_atencion_activa_por_cola_live ON atenciones(cola_atencion_id) WHERE cola_atencion_id IS NOT NULL AND deleted_at IS NULL AND estado = 'ACTIVA'`);

    // ── General Indexes ──
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_roles_deleted_at ON roles(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_personas_deleted_at ON personas(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_deleted_at ON usuarios(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_empleados_deleted_at ON empleados(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_clientes_deleted_at ON clientes(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_refresh_tokens_usuario_id ON usuarios_refresh_tokens(usuario_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_refresh_tokens_deleted_at ON usuarios_refresh_tokens(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_especies_deleted_at ON especies_catalogo(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_razas_especie_id ON razas_catalogo(especie_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_razas_deleted_at ON razas_catalogo(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_colores_deleted_at ON colores_catalogo(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_vacunas_deleted_at ON vacunas_catalogo(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_antiparasitarios_deleted_at ON catalogo_antiparasitarios(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_pacientes_especie_id ON pacientes(especie_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_pacientes_raza_id ON pacientes(raza_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_pacientes_color_id ON pacientes(color_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_pacientes_nombre ON pacientes(nombre)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_pacientes_deleted_at ON pacientes(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_pacientes_tutores_cliente_id ON pacientes_tutores(cliente_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_pacientes_tutores_deleted_at ON pacientes_tutores(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_pacientes_condiciones_paciente_id ON pacientes_condiciones(paciente_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_pacientes_condiciones_deleted_at ON pacientes_condiciones(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_citas_paciente_id ON citas(paciente_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_citas_mvz_id ON citas(mvz_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_citas_fecha_programada ON citas(fecha_programada)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_citas_estado_cita ON citas(estado_cita)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_citas_deleted_at ON citas(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_cola_fecha ON cola_atenciones(fecha)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_cola_paciente_id ON cola_atenciones(paciente_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_cola_mvz_id ON cola_atenciones(mvz_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_cola_estado ON cola_atenciones(estado)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_cola_deleted_at ON cola_atenciones(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_atenciones_paciente_id ON atenciones(paciente_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_atenciones_mvz_id ON atenciones(mvz_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_atenciones_estado ON atenciones(estado)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_atenciones_fecha_inicio ON atenciones(fecha_hora_inicio)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_atenciones_deleted_at ON atenciones(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_atenciones_motivo_deleted_at ON atenciones_motivo_consulta(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_atenciones_anamnesis_deleted_at ON atenciones_anamnesis(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_atenciones_examen_deleted_at ON atenciones_examen_clinico(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_atenciones_medio_deleted_at ON atenciones_datos_medioambientales(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_atenciones_impresion_deleted_at ON atenciones_impresion_clinica(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_atenciones_plan_deleted_at ON atenciones_plan(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_tratamientos_atencion_id ON tratamientos(atencion_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_tratamientos_deleted_at ON tratamientos(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_tratamientos_item_tratamiento_id ON tratamientos_item(tratamiento_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_tratamientos_item_deleted_at ON tratamientos_item(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_vacunaciones_atencion_id ON vacunaciones_evento(atencion_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_vacunaciones_vacuna_id ON vacunaciones_evento(vacuna_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_vacunaciones_deleted_at ON vacunaciones_evento(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_desparasitaciones_atencion_id ON desparasitaciones_evento(atencion_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_desparasitaciones_producto_id ON desparasitaciones_evento(producto_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_desparasitaciones_deleted_at ON desparasitaciones_evento(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_cirugias_atencion_id ON cirugias(atencion_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_cirugias_estado ON cirugias(estado_cirugia)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_cirugias_deleted_at ON cirugias(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_procedimientos_atencion_id ON procedimientos(atencion_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_procedimientos_deleted_at ON procedimientos(deleted_at)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_archivos_media_owner ON archivos_media(owner_type, owner_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_archivos_media_tipo ON archivos_media(tipo_media)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_archivos_media_provider ON archivos_media(provider)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_archivos_media_deleted_at ON archivos_media(deleted_at)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ── Drop general indexes ──
    const generalIndexes = [
      'idx_archivos_media_deleted_at', 'idx_archivos_media_provider', 'idx_archivos_media_tipo', 'idx_archivos_media_owner',
      'idx_procedimientos_deleted_at', 'idx_procedimientos_atencion_id',
      'idx_cirugias_deleted_at', 'idx_cirugias_estado', 'idx_cirugias_atencion_id',
      'idx_desparasitaciones_deleted_at', 'idx_desparasitaciones_producto_id', 'idx_desparasitaciones_atencion_id',
      'idx_vacunaciones_deleted_at', 'idx_vacunaciones_vacuna_id', 'idx_vacunaciones_atencion_id',
      'idx_tratamientos_item_deleted_at', 'idx_tratamientos_item_tratamiento_id',
      'idx_tratamientos_deleted_at', 'idx_tratamientos_atencion_id',
      'idx_atenciones_plan_deleted_at', 'idx_atenciones_impresion_deleted_at', 'idx_atenciones_medio_deleted_at',
      'idx_atenciones_examen_deleted_at', 'idx_atenciones_anamnesis_deleted_at', 'idx_atenciones_motivo_deleted_at',
      'idx_atenciones_deleted_at', 'idx_atenciones_fecha_inicio', 'idx_atenciones_estado', 'idx_atenciones_mvz_id', 'idx_atenciones_paciente_id',
      'idx_cola_deleted_at', 'idx_cola_estado', 'idx_cola_mvz_id', 'idx_cola_paciente_id', 'idx_cola_fecha',
      'idx_citas_deleted_at', 'idx_citas_estado_cita', 'idx_citas_fecha_programada', 'idx_citas_mvz_id', 'idx_citas_paciente_id',
      'idx_pacientes_condiciones_deleted_at', 'idx_pacientes_condiciones_paciente_id',
      'idx_pacientes_tutores_deleted_at', 'idx_pacientes_tutores_cliente_id',
      'idx_pacientes_deleted_at', 'idx_pacientes_nombre', 'idx_pacientes_color_id', 'idx_pacientes_raza_id', 'idx_pacientes_especie_id',
      'idx_antiparasitarios_deleted_at', 'idx_vacunas_deleted_at', 'idx_colores_deleted_at',
      'idx_razas_deleted_at', 'idx_razas_especie_id', 'idx_especies_deleted_at',
      'idx_refresh_tokens_deleted_at', 'idx_refresh_tokens_usuario_id',
      'idx_clientes_deleted_at', 'idx_empleados_deleted_at', 'idx_usuarios_deleted_at', 'idx_personas_deleted_at', 'idx_roles_deleted_at',
    ];
    for (const idx of generalIndexes) {
      await queryRunner.query(`DROP INDEX IF EXISTS ${idx}`);
    }

    // ── Drop unique indexes ──
    const uniqueIndexes = [
      'uq_atencion_activa_por_cola_live', 'uq_atencion_activa_por_paciente_live',
      'uq_cola_atenciones_cita_live', 'uq_citas_mvz_slot_activo_live',
      'uq_pacientes_tutor_principal_live', 'uq_pacientes_microchip_live', 'uq_pacientes_codigo_live',
      'uq_antiparasitarios_nombre_live', 'uq_vacunas_nombre_live', 'uq_colores_nombre_live',
      'uq_razas_especie_nombre_live', 'uq_especies_nombre_live',
      'uq_clientes_persona_live', 'uq_empleados_codigo_live', 'uq_empleados_persona_live',
      'uq_usuarios_correo_live', 'uq_usuarios_persona_live', 'uq_personas_cedula_live', 'uq_roles_nombre_live',
    ];
    for (const idx of uniqueIndexes) {
      await queryRunner.query(`DROP INDEX IF EXISTS ${idx}`);
    }

    // ── Drop deleted_by FKs ──
    const deletedByFks: Array<{ table: string; constraint: string }> = [
      { table: 'archivos_media', constraint: 'fk_archivos_media_deleted_by' },
      { table: 'procedimientos', constraint: 'fk_procedimientos_deleted_by' },
      { table: 'cirugias', constraint: 'fk_cirugias_deleted_by' },
      { table: 'desparasitaciones_evento', constraint: 'fk_desparasitaciones_deleted_by' },
      { table: 'vacunaciones_evento', constraint: 'fk_vacunaciones_deleted_by' },
      { table: 'tratamientos_item', constraint: 'fk_tratamientos_item_deleted_by' },
      { table: 'tratamientos', constraint: 'fk_tratamientos_deleted_by' },
      { table: 'atenciones_plan', constraint: 'fk_atenciones_plan_deleted_by' },
      { table: 'atenciones_impresion_clinica', constraint: 'fk_atenciones_impresion_deleted_by' },
      { table: 'atenciones_datos_medioambientales', constraint: 'fk_atenciones_medio_deleted_by' },
      { table: 'atenciones_examen_clinico', constraint: 'fk_atenciones_examen_deleted_by' },
      { table: 'atenciones_anamnesis', constraint: 'fk_atenciones_anamnesis_deleted_by' },
      { table: 'atenciones_motivo_consulta', constraint: 'fk_atenciones_motivo_deleted_by' },
      { table: 'atenciones', constraint: 'fk_atenciones_deleted_by' },
      { table: 'cola_atenciones', constraint: 'fk_cola_deleted_by' },
      { table: 'citas', constraint: 'fk_citas_deleted_by' },
      { table: 'pacientes_condiciones', constraint: 'fk_pacientes_condiciones_deleted_by' },
      { table: 'pacientes_tutores', constraint: 'fk_pacientes_tutores_deleted_by' },
      { table: 'pacientes', constraint: 'fk_pacientes_deleted_by' },
      { table: 'catalogo_antiparasitarios', constraint: 'fk_antiparasitarios_deleted_by' },
      { table: 'vacunas_catalogo', constraint: 'fk_vacunas_deleted_by' },
      { table: 'colores_catalogo', constraint: 'fk_colores_deleted_by' },
      { table: 'razas_catalogo', constraint: 'fk_razas_deleted_by' },
      { table: 'especies_catalogo', constraint: 'fk_especies_deleted_by' },
      { table: 'usuarios_refresh_tokens', constraint: 'fk_refresh_tokens_deleted_by' },
      { table: 'clientes', constraint: 'fk_clientes_deleted_by' },
      { table: 'empleados', constraint: 'fk_empleados_deleted_by' },
      { table: 'usuarios', constraint: 'fk_usuarios_deleted_by' },
      { table: 'personas', constraint: 'fk_personas_deleted_by' },
      { table: 'roles', constraint: 'fk_roles_deleted_by' },
    ];
    for (const fk of deletedByFks) {
      await queryRunner.query(`ALTER TABLE ${fk.table} DROP CONSTRAINT IF EXISTS ${fk.constraint}`);
    }
  }
}
