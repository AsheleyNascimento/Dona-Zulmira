import { PartialType } from '@nestjs/mapped-types';
import { CreateMoradorDto } from './create-morador.dto';

export class UpdateMoradorDto extends PartialType(CreateMoradorDto) {}
