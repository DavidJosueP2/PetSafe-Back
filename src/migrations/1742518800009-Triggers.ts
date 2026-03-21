import { MigrationInterface, QueryRunner } from 'typeorm';

export class Triggers1742518800009 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── updated_at triggers ──
    const updatedAtTables: Array<{ trigger: string; table: string }> = [
      { trigger: 'trg_roles_updated_at', table: 'roles' },
      { trigger: 'trg_personas_updated_at', table: 'personas' },
      { trigger: 'trg_usuarios_updated_at', table: 'usuarios' },
      { trigger: 'trg_empleados_updated_at', table: 'empleados' },
      { trigger: 'trg_clientes_updated_at', table: 'clientes' },
      { trigger: 'trg_especies_updated_at', table: 'especies_catalogo' },
      { trigger: 'trg_razas_updated_at', table: 'razas_catalogo' },
      { trigger: 'trg_colores_updated_at', table: 'colores_catalogo' },
      { trigger: 'trg_vacunas_updated_at', table: 'vacunas_catalogo' },
      { trigger: 'trg_antiparasitarios_updated_at', table: 'catalogo_antiparasitarios' },
      { trigger: 'trg_pacientes_updated_at', table: 'pacientes' },
      { trigger: 'trg_pacientes_condiciones_updated_at', table: 'pacientes_condiciones' },
      { trigger: 'trg_citas_updated_at', table: 'citas' },
      { trigger: 'trg_cola_updated_at', table: 'cola_atenciones' },
      { trigger: 'trg_atenciones_updated_at', table: 'atenciones' },
      { trigger: 'trg_atenciones_motivo_updated_at', table: 'atenciones_motivo_consulta' },
      { trigger: 'trg_atenciones_anamnesis_updated_at', table: 'atenciones_anamnesis' },
      { trigger: 'trg_atenciones_examen_updated_at', table: 'atenciones_examen_clinico' },
      { trigger: 'trg_atenciones_medio_updated_at', table: 'atenciones_datos_medioambientales' },
      { trigger: 'trg_atenciones_impresion_updated_at', table: 'atenciones_impresion_clinica' },
      { trigger: 'trg_atenciones_plan_updated_at', table: 'atenciones_plan' },
      { trigger: 'trg_tratamientos_updated_at', table: 'tratamientos' },
      { trigger: 'trg_tratamientos_item_updated_at', table: 'tratamientos_item' },
      { trigger: 'trg_vacunaciones_updated_at', table: 'vacunaciones_evento' },
      { trigger: 'trg_desparasitaciones_updated_at', table: 'desparasitaciones_evento' },
      { trigger: 'trg_cirugias_updated_at', table: 'cirugias' },
      { trigger: 'trg_procedimientos_updated_at', table: 'procedimientos' },
      { trigger: 'trg_archivos_media_updated_at', table: 'archivos_media' },
    ];

    for (const t of updatedAtTables) {
      await queryRunner.query(`DROP TRIGGER IF EXISTS ${t.trigger} ON ${t.table}`);
      await queryRunner.query(`
        CREATE TRIGGER ${t.trigger}
        BEFORE UPDATE ON ${t.table}
        FOR EACH ROW
        EXECUTE FUNCTION set_updated_at()
      `);
    }

    // ── validar_raza trigger ──
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_pacientes_validar_raza ON pacientes`);
    await queryRunner.query(`
      CREATE TRIGGER trg_pacientes_validar_raza
      BEFORE INSERT OR UPDATE ON pacientes
      FOR EACH ROW
      EXECUTE FUNCTION validar_raza_corresponde_especie()
    `);

    // ── softdelete consistency triggers ──
    const softdeleteTables: Array<{ trigger: string; table: string }> = [
      { trigger: 'trg_roles_softdelete', table: 'roles' },
      { trigger: 'trg_personas_softdelete', table: 'personas' },
      { trigger: 'trg_usuarios_softdelete', table: 'usuarios' },
      { trigger: 'trg_empleados_softdelete', table: 'empleados' },
      { trigger: 'trg_clientes_softdelete', table: 'clientes' },
      { trigger: 'trg_refresh_tokens_softdelete', table: 'usuarios_refresh_tokens' },
      { trigger: 'trg_especies_softdelete', table: 'especies_catalogo' },
      { trigger: 'trg_razas_softdelete', table: 'razas_catalogo' },
      { trigger: 'trg_colores_softdelete', table: 'colores_catalogo' },
      { trigger: 'trg_vacunas_softdelete', table: 'vacunas_catalogo' },
      { trigger: 'trg_antiparasitarios_softdelete', table: 'catalogo_antiparasitarios' },
      { trigger: 'trg_pacientes_softdelete', table: 'pacientes' },
      { trigger: 'trg_pacientes_tutores_softdelete', table: 'pacientes_tutores' },
      { trigger: 'trg_pacientes_condiciones_softdelete', table: 'pacientes_condiciones' },
      { trigger: 'trg_citas_softdelete', table: 'citas' },
      { trigger: 'trg_cola_softdelete', table: 'cola_atenciones' },
      { trigger: 'trg_atenciones_softdelete', table: 'atenciones' },
      { trigger: 'trg_atenciones_motivo_softdelete', table: 'atenciones_motivo_consulta' },
      { trigger: 'trg_atenciones_anamnesis_softdelete', table: 'atenciones_anamnesis' },
      { trigger: 'trg_atenciones_examen_softdelete', table: 'atenciones_examen_clinico' },
      { trigger: 'trg_atenciones_medio_softdelete', table: 'atenciones_datos_medioambientales' },
      { trigger: 'trg_atenciones_impresion_softdelete', table: 'atenciones_impresion_clinica' },
      { trigger: 'trg_atenciones_plan_softdelete', table: 'atenciones_plan' },
      { trigger: 'trg_tratamientos_softdelete', table: 'tratamientos' },
      { trigger: 'trg_tratamientos_item_softdelete', table: 'tratamientos_item' },
      { trigger: 'trg_vacunaciones_softdelete', table: 'vacunaciones_evento' },
      { trigger: 'trg_desparasitaciones_softdelete', table: 'desparasitaciones_evento' },
      { trigger: 'trg_cirugias_softdelete', table: 'cirugias' },
      { trigger: 'trg_procedimientos_softdelete', table: 'procedimientos' },
      { trigger: 'trg_archivos_media_softdelete', table: 'archivos_media' },
    ];

    for (const t of softdeleteTables) {
      await queryRunner.query(`DROP TRIGGER IF EXISTS ${t.trigger} ON ${t.table}`);
      await queryRunner.query(`
        CREATE TRIGGER ${t.trigger}
        BEFORE INSERT OR UPDATE ON ${t.table}
        FOR EACH ROW
        EXECUTE FUNCTION enforce_softdelete_consistency()
      `);
    }

    // ── validate_softdelete_user_reference triggers ──
    const validateSoftdeleteUserTables: Array<{ trigger: string; table: string }> = [
      { trigger: 'trg_roles_validate_softdelete_user', table: 'roles' },
      { trigger: 'trg_personas_validate_softdelete_user', table: 'personas' },
      { trigger: 'trg_usuarios_validate_softdelete_user', table: 'usuarios' },
      { trigger: 'trg_empleados_validate_softdelete_user', table: 'empleados' },
      { trigger: 'trg_clientes_validate_softdelete_user', table: 'clientes' },
      { trigger: 'trg_refresh_tokens_validate_softdelete_user', table: 'usuarios_refresh_tokens' },
      { trigger: 'trg_especies_validate_softdelete_user', table: 'especies_catalogo' },
      { trigger: 'trg_razas_validate_softdelete_user', table: 'razas_catalogo' },
      { trigger: 'trg_colores_validate_softdelete_user', table: 'colores_catalogo' },
      { trigger: 'trg_vacunas_validate_softdelete_user', table: 'vacunas_catalogo' },
      { trigger: 'trg_antiparasitarios_validate_softdelete_user', table: 'catalogo_antiparasitarios' },
      { trigger: 'trg_pacientes_validate_softdelete_user', table: 'pacientes' },
      { trigger: 'trg_pacientes_tutores_validate_softdelete_user', table: 'pacientes_tutores' },
      { trigger: 'trg_pacientes_condiciones_validate_softdelete_user', table: 'pacientes_condiciones' },
      { trigger: 'trg_citas_validate_softdelete_user', table: 'citas' },
      { trigger: 'trg_cola_validate_softdelete_user', table: 'cola_atenciones' },
      { trigger: 'trg_atenciones_validate_softdelete_user', table: 'atenciones' },
      { trigger: 'trg_atenciones_motivo_validate_softdelete_user', table: 'atenciones_motivo_consulta' },
      { trigger: 'trg_atenciones_anamnesis_validate_softdelete_user', table: 'atenciones_anamnesis' },
      { trigger: 'trg_atenciones_examen_validate_softdelete_user', table: 'atenciones_examen_clinico' },
      { trigger: 'trg_atenciones_medio_validate_softdelete_user', table: 'atenciones_datos_medioambientales' },
      { trigger: 'trg_atenciones_impresion_validate_softdelete_user', table: 'atenciones_impresion_clinica' },
      { trigger: 'trg_atenciones_plan_validate_softdelete_user', table: 'atenciones_plan' },
      { trigger: 'trg_tratamientos_validate_softdelete_user', table: 'tratamientos' },
      { trigger: 'trg_tratamientos_item_validate_softdelete_user', table: 'tratamientos_item' },
      { trigger: 'trg_vacunaciones_validate_softdelete_user', table: 'vacunaciones_evento' },
      { trigger: 'trg_desparasitaciones_validate_softdelete_user', table: 'desparasitaciones_evento' },
      { trigger: 'trg_cirugias_validate_softdelete_user', table: 'cirugias' },
      { trigger: 'trg_procedimientos_validate_softdelete_user', table: 'procedimientos' },
      { trigger: 'trg_archivos_media_validate_softdelete_user', table: 'archivos_media' },
    ];

    for (const t of validateSoftdeleteUserTables) {
      await queryRunner.query(`DROP TRIGGER IF EXISTS ${t.trigger} ON ${t.table}`);
      await queryRunner.query(`
        CREATE TRIGGER ${t.trigger}
        BEFORE INSERT OR UPDATE ON ${t.table}
        FOR EACH ROW
        EXECUTE FUNCTION validate_softdelete_user_reference()
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ── Drop validate_softdelete_user triggers ──
    const validateTriggers = [
      { trigger: 'trg_archivos_media_validate_softdelete_user', table: 'archivos_media' },
      { trigger: 'trg_procedimientos_validate_softdelete_user', table: 'procedimientos' },
      { trigger: 'trg_cirugias_validate_softdelete_user', table: 'cirugias' },
      { trigger: 'trg_desparasitaciones_validate_softdelete_user', table: 'desparasitaciones_evento' },
      { trigger: 'trg_vacunaciones_validate_softdelete_user', table: 'vacunaciones_evento' },
      { trigger: 'trg_tratamientos_item_validate_softdelete_user', table: 'tratamientos_item' },
      { trigger: 'trg_tratamientos_validate_softdelete_user', table: 'tratamientos' },
      { trigger: 'trg_atenciones_plan_validate_softdelete_user', table: 'atenciones_plan' },
      { trigger: 'trg_atenciones_impresion_validate_softdelete_user', table: 'atenciones_impresion_clinica' },
      { trigger: 'trg_atenciones_medio_validate_softdelete_user', table: 'atenciones_datos_medioambientales' },
      { trigger: 'trg_atenciones_examen_validate_softdelete_user', table: 'atenciones_examen_clinico' },
      { trigger: 'trg_atenciones_anamnesis_validate_softdelete_user', table: 'atenciones_anamnesis' },
      { trigger: 'trg_atenciones_motivo_validate_softdelete_user', table: 'atenciones_motivo_consulta' },
      { trigger: 'trg_atenciones_validate_softdelete_user', table: 'atenciones' },
      { trigger: 'trg_cola_validate_softdelete_user', table: 'cola_atenciones' },
      { trigger: 'trg_citas_validate_softdelete_user', table: 'citas' },
      { trigger: 'trg_pacientes_condiciones_validate_softdelete_user', table: 'pacientes_condiciones' },
      { trigger: 'trg_pacientes_tutores_validate_softdelete_user', table: 'pacientes_tutores' },
      { trigger: 'trg_pacientes_validate_softdelete_user', table: 'pacientes' },
      { trigger: 'trg_antiparasitarios_validate_softdelete_user', table: 'catalogo_antiparasitarios' },
      { trigger: 'trg_vacunas_validate_softdelete_user', table: 'vacunas_catalogo' },
      { trigger: 'trg_colores_validate_softdelete_user', table: 'colores_catalogo' },
      { trigger: 'trg_razas_validate_softdelete_user', table: 'razas_catalogo' },
      { trigger: 'trg_especies_validate_softdelete_user', table: 'especies_catalogo' },
      { trigger: 'trg_refresh_tokens_validate_softdelete_user', table: 'usuarios_refresh_tokens' },
      { trigger: 'trg_clientes_validate_softdelete_user', table: 'clientes' },
      { trigger: 'trg_empleados_validate_softdelete_user', table: 'empleados' },
      { trigger: 'trg_usuarios_validate_softdelete_user', table: 'usuarios' },
      { trigger: 'trg_personas_validate_softdelete_user', table: 'personas' },
      { trigger: 'trg_roles_validate_softdelete_user', table: 'roles' },
    ];
    for (const t of validateTriggers) {
      await queryRunner.query(`DROP TRIGGER IF EXISTS ${t.trigger} ON ${t.table}`);
    }

    // ── Drop softdelete triggers ──
    const softdeleteTriggers = [
      { trigger: 'trg_archivos_media_softdelete', table: 'archivos_media' },
      { trigger: 'trg_procedimientos_softdelete', table: 'procedimientos' },
      { trigger: 'trg_cirugias_softdelete', table: 'cirugias' },
      { trigger: 'trg_desparasitaciones_softdelete', table: 'desparasitaciones_evento' },
      { trigger: 'trg_vacunaciones_softdelete', table: 'vacunaciones_evento' },
      { trigger: 'trg_tratamientos_item_softdelete', table: 'tratamientos_item' },
      { trigger: 'trg_tratamientos_softdelete', table: 'tratamientos' },
      { trigger: 'trg_atenciones_plan_softdelete', table: 'atenciones_plan' },
      { trigger: 'trg_atenciones_impresion_softdelete', table: 'atenciones_impresion_clinica' },
      { trigger: 'trg_atenciones_medio_softdelete', table: 'atenciones_datos_medioambientales' },
      { trigger: 'trg_atenciones_examen_softdelete', table: 'atenciones_examen_clinico' },
      { trigger: 'trg_atenciones_anamnesis_softdelete', table: 'atenciones_anamnesis' },
      { trigger: 'trg_atenciones_motivo_softdelete', table: 'atenciones_motivo_consulta' },
      { trigger: 'trg_atenciones_softdelete', table: 'atenciones' },
      { trigger: 'trg_cola_softdelete', table: 'cola_atenciones' },
      { trigger: 'trg_citas_softdelete', table: 'citas' },
      { trigger: 'trg_pacientes_condiciones_softdelete', table: 'pacientes_condiciones' },
      { trigger: 'trg_pacientes_tutores_softdelete', table: 'pacientes_tutores' },
      { trigger: 'trg_pacientes_softdelete', table: 'pacientes' },
      { trigger: 'trg_antiparasitarios_softdelete', table: 'catalogo_antiparasitarios' },
      { trigger: 'trg_vacunas_softdelete', table: 'vacunas_catalogo' },
      { trigger: 'trg_colores_softdelete', table: 'colores_catalogo' },
      { trigger: 'trg_razas_softdelete', table: 'razas_catalogo' },
      { trigger: 'trg_especies_softdelete', table: 'especies_catalogo' },
      { trigger: 'trg_refresh_tokens_softdelete', table: 'usuarios_refresh_tokens' },
      { trigger: 'trg_clientes_softdelete', table: 'clientes' },
      { trigger: 'trg_empleados_softdelete', table: 'empleados' },
      { trigger: 'trg_usuarios_softdelete', table: 'usuarios' },
      { trigger: 'trg_personas_softdelete', table: 'personas' },
      { trigger: 'trg_roles_softdelete', table: 'roles' },
    ];
    for (const t of softdeleteTriggers) {
      await queryRunner.query(`DROP TRIGGER IF EXISTS ${t.trigger} ON ${t.table}`);
    }

    // ── Drop validar_raza trigger ──
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_pacientes_validar_raza ON pacientes`);

    // ── Drop updated_at triggers ──
    const updatedAtTriggers = [
      { trigger: 'trg_archivos_media_updated_at', table: 'archivos_media' },
      { trigger: 'trg_procedimientos_updated_at', table: 'procedimientos' },
      { trigger: 'trg_cirugias_updated_at', table: 'cirugias' },
      { trigger: 'trg_desparasitaciones_updated_at', table: 'desparasitaciones_evento' },
      { trigger: 'trg_vacunaciones_updated_at', table: 'vacunaciones_evento' },
      { trigger: 'trg_tratamientos_item_updated_at', table: 'tratamientos_item' },
      { trigger: 'trg_tratamientos_updated_at', table: 'tratamientos' },
      { trigger: 'trg_atenciones_plan_updated_at', table: 'atenciones_plan' },
      { trigger: 'trg_atenciones_impresion_updated_at', table: 'atenciones_impresion_clinica' },
      { trigger: 'trg_atenciones_medio_updated_at', table: 'atenciones_datos_medioambientales' },
      { trigger: 'trg_atenciones_examen_updated_at', table: 'atenciones_examen_clinico' },
      { trigger: 'trg_atenciones_anamnesis_updated_at', table: 'atenciones_anamnesis' },
      { trigger: 'trg_atenciones_motivo_updated_at', table: 'atenciones_motivo_consulta' },
      { trigger: 'trg_atenciones_updated_at', table: 'atenciones' },
      { trigger: 'trg_cola_updated_at', table: 'cola_atenciones' },
      { trigger: 'trg_citas_updated_at', table: 'citas' },
      { trigger: 'trg_pacientes_condiciones_updated_at', table: 'pacientes_condiciones' },
      { trigger: 'trg_pacientes_updated_at', table: 'pacientes' },
      { trigger: 'trg_antiparasitarios_updated_at', table: 'catalogo_antiparasitarios' },
      { trigger: 'trg_vacunas_updated_at', table: 'vacunas_catalogo' },
      { trigger: 'trg_colores_updated_at', table: 'colores_catalogo' },
      { trigger: 'trg_razas_updated_at', table: 'razas_catalogo' },
      { trigger: 'trg_especies_updated_at', table: 'especies_catalogo' },
      { trigger: 'trg_clientes_updated_at', table: 'clientes' },
      { trigger: 'trg_empleados_updated_at', table: 'empleados' },
      { trigger: 'trg_usuarios_updated_at', table: 'usuarios' },
      { trigger: 'trg_personas_updated_at', table: 'personas' },
      { trigger: 'trg_roles_updated_at', table: 'roles' },
    ];
    for (const t of updatedAtTriggers) {
      await queryRunner.query(`DROP TRIGGER IF EXISTS ${t.trigger} ON ${t.table}`);
    }
  }
}
