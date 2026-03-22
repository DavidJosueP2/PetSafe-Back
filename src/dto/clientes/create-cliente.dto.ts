import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { GenderEnum } from '../../common/enums/index.js';

export class CreateClienteDto {
  @IsNotEmpty()
  @IsString()
  nombres!: string;

  @IsNotEmpty()
  @IsString()
  apellidos!: string;

  @IsOptional()
  @IsString()
  cedula?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsEnum(GenderEnum)
  genero?: GenderEnum;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
