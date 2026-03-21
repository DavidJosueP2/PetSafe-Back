import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsDateString,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { PatientSexEnum } from '../../common/enums/index.js';

export class CreatePacienteDto {
  @IsNotEmpty()
  @IsString()
  nombre!: string;

  @IsNotEmpty()
  @IsUUID()
  especieId!: string;

  @IsNotEmpty()
  @IsEnum(PatientSexEnum)
  sexo!: PatientSexEnum;

  @IsOptional()
  @IsUUID()
  razaId?: string;

  @IsOptional()
  @IsUUID()
  colorId?: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsNumber()
  pesoActual?: number;

  @IsOptional()
  @IsBoolean()
  esterilizado?: boolean;

  @IsOptional()
  @IsString()
  microchipCodigo?: string;

  @IsOptional()
  @IsString()
  senasParticulares?: string;

  @IsOptional()
  @IsString()
  alergiasGenerales?: string;

  @IsOptional()
  @IsString()
  antecedentesGenerales?: string;
}
