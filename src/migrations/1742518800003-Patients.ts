import { MigrationInterface, QueryRunner } from 'typeorm';

export class Patients1742518800003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS pacientes (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        codigo varchar(40),
        nombre varchar(120) NOT NULL,
        especie_id uuid NOT NULL,
        raza_id uuid,
        color_id uuid,
        sexo patient_sex_enum NOT NULL,
        fecha_nacimiento date,
        peso_actual numeric(8,2),
        esterilizado boolean NOT NULL DEFAULT false,
        microchip_codigo varchar(80),
        senas_particulares text,
        alergias_generales text,
        antecedentes_generales text,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        CONSTRAINT ck_pacientes_peso_actual CHECK (peso_actual IS NULL OR peso_actual > 0),
        CONSTRAINT fk_pacientes_especie FOREIGN KEY (especie_id) REFERENCES especies_catalogo(id) ON DELETE RESTRICT,
        CONSTRAINT fk_pacientes_raza FOREIGN KEY (raza_id) REFERENCES razas_catalogo(id) ON DELETE SET NULL,
        CONSTRAINT fk_pacientes_color FOREIGN KEY (color_id) REFERENCES colores_catalogo(id) ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS pacientes_tutores (
        paciente_id uuid NOT NULL,
        cliente_id uuid NOT NULL,
        es_principal boolean NOT NULL DEFAULT false,
        parentesco_o_relacion varchar(80),
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        PRIMARY KEY (paciente_id, cliente_id),
        CONSTRAINT fk_pacientes_tutores_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
        CONSTRAINT fk_pacientes_tutores_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS pacientes_condiciones (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        paciente_id uuid NOT NULL,
        tipo varchar(80) NOT NULL,
        nombre varchar(120) NOT NULL,
        descripcion text,
        activa boolean NOT NULL DEFAULT true,
        activo boolean NOT NULL DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        deleted_at timestamp without time zone,
        deleted_by_usuario_id uuid,
        CONSTRAINT fk_pacientes_condiciones_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS pacientes_condiciones CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS pacientes_tutores CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS pacientes CASCADE`);
  }
}
