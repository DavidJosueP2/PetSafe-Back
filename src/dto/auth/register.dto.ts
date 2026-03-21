import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { GenderEnum } from '../../common/enums/index.js';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  nombres!: string;

  @IsNotEmpty()
  @IsString()
  apellidos!: string;

  @IsEmail()
  correo!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;

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
