import { IsInt, IsOptional, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEncounterDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  queueEntryId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  patientId?: number;

  @IsOptional()
  @MaxLength(2000)
  generalNotes?: string;
}
