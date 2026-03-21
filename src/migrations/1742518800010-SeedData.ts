import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedData1742518800010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO roles (nombre, activo)
      VALUES
        ('ADMIN', true),
        ('MVZ', true),
        ('RECEPCIONISTA', true),
        ('CLIENTE_APP', true)
      ON CONFLICT DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO especies_catalogo (nombre, descripcion, activo)
      VALUES
        ('Perro', 'Caninos domésticos', true),
        ('Gato', 'Felinos domésticos', true),
        ('Otro', 'Otras especies atendidas', true)
      ON CONFLICT DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO colores_catalogo (nombre, activo)
      VALUES
        ('Negro', true),
        ('Blanco', true),
        ('Marrón', true),
        ('Gris', true),
        ('Dorado', true),
        ('Café', true),
        ('Beige', true),
        ('Atigrado', true)
      ON CONFLICT DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO vacunas_catalogo (nombre, especie, es_revacunacion, activa, activo)
      VALUES
        ('Triple Canina', 'PERRO', false, true, true),
        ('Antirrábica Canina', 'PERRO', false, true, true),
        ('Séxtuple Canina', 'PERRO', false, true, true),
        ('Triple Felina', 'GATO', false, true, true),
        ('Antirrábica Felina', 'GATO', false, true, true)
      ON CONFLICT DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO catalogo_antiparasitarios (nombre, tipo, activo)
      VALUES
        ('Albendazol', 'INTERNO', true),
        ('Fipronil', 'EXTERNO', true),
        ('Milbemicina + Praziquantel', 'MIXTO', true)
      ON CONFLICT DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM catalogo_antiparasitarios WHERE nombre IN ('Albendazol', 'Fipronil', 'Milbemicina + Praziquantel')`);
    await queryRunner.query(`DELETE FROM vacunas_catalogo WHERE nombre IN ('Triple Canina', 'Antirrábica Canina', 'Séxtuple Canina', 'Triple Felina', 'Antirrábica Felina')`);
    await queryRunner.query(`DELETE FROM colores_catalogo WHERE nombre IN ('Negro', 'Blanco', 'Marrón', 'Gris', 'Dorado', 'Café', 'Beige', 'Atigrado')`);
    await queryRunner.query(`DELETE FROM especies_catalogo WHERE nombre IN ('Perro', 'Gato', 'Otro')`);
    await queryRunner.query(`DELETE FROM roles WHERE nombre IN ('ADMIN', 'MVZ', 'RECEPCIONISTA', 'CLIENTE_APP')`);
  }
}
