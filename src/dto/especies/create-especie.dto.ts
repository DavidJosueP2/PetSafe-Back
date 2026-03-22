import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateEspecieDto {
  @IsNotEmpty({ message: 'El nombre de la especie es obligatorio' })
  @IsString({ message: 'El nombre de la especie debe ser texto' })
  nombre!: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  descripcion?: string;
}
