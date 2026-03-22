import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class ListClientesQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsString()
  nombres?: string;

  @IsOptional()
  @IsString()
  cedula?: string;

  @IsOptional()
  @IsString()
  correo?: string;

  @IsOptional()
  @IsString()
  mascotaNombre?: string;
}
