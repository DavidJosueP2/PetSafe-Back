import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCondicionDto {
  @IsNotEmpty({ message: 'El tipo de condición es obligatorio' })
  @IsString({ message: 'El tipo de condición debe ser texto' })
  tipo!: string;

  @IsNotEmpty({ message: 'El nombre de la condición es obligatorio' })
  @IsString({ message: 'El nombre de la condición debe ser texto' })
  nombre!: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  descripcion?: string;

  @IsOptional()
  @IsBoolean({ message: 'El campo activa debe ser verdadero o falso' })
  activa?: boolean;
}
