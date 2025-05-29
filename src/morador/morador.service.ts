import { Injectable } from '@nestjs/common';
import { CreateMoradorDto } from './dto/create-morador.dto';
import { UpdateMoradorDto } from './dto/update-morador.dto';

@Injectable()
export class MoradorService {
  create(createMoradorDto: CreateMoradorDto) {
    return 'This action adds a new morador';
  }

  findAll() {
    return `This action returns all morador`;
  }

  findOne(id: number) {
    return `This action returns a #${id} morador`;
  }

  update(id: number, updateMoradorDto: UpdateMoradorDto) {
    return `This action updates a #${id} morador`;
  }

  remove(id: number) {
    return `This action removes a #${id} morador`;
  }
}
