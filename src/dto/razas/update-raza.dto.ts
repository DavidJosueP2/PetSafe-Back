import { PartialType } from '@nestjs/mapped-types';
import { CreateRazaDto } from './create-raza.dto.js';

export class UpdateRazaDto extends PartialType(CreateRazaDto) {}
