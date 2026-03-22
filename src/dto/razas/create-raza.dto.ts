import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateRazaDto {
  @IsNotEmpty({ message: 'La especie es obligatoria' })
  @IsUUID('4', { message: 'El ID de especie debe ser un UUID válido' })
  especieId!: string;

  @IsNotEmpty({ message: 'El nombre de la raza es obligatorio' })
  @IsString({ message: 'El nombre de la raza debe ser texto' })
  nombre!: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  descripcion?: string;
}
