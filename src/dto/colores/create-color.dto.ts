import { IsNotEmpty, IsString } from 'class-validator';

export class CreateColorDto {
  @IsNotEmpty({ message: 'El nombre del color es obligatorio' })
  @IsString({ message: 'El nombre del color debe ser texto' })
  nombre!: string;
}
