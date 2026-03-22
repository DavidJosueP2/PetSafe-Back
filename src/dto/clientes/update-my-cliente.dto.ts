import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsEmail,
} from 'class-validator';
import { GenderEnum } from '../../common/enums/index.js';

export class UpdateMyClienteDto {
  @IsOptional()
  @IsEmail()
  correo?: string;

  @IsOptional()
  @IsString()
  nombres?: string;

  @IsOptional()
  @IsString()
  apellidos?: string;

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
}
