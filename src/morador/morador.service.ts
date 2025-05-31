import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Certifique-se de que o caminho está correto
import { CreateMoradorDto } from './dto/create-morador.dto';
import { UpdateMoradorDto } from './dto/update-morador.dto';

@Injectable()
export class MoradorService {
  constructor(private prisma: PrismaService) {}

  async create(createMoradorDto: CreateMoradorDto) {
    // Convert data_cadastro string to Date object
    const dataCadastro = new Date(createMoradorDto.data_cadastro);

    // Você pode adicionar validações de negócio aqui, como verificar se o usuário existe, etc.
    // Ex: verificar se o CPF já existe antes de criar
    const existingMorador = await this.prisma.morador.findUnique({
      where: { cpf: createMoradorDto.cpf },
    });

    if (existingMorador) {
      throw new Error('CPF já cadastrado para outro morador.'); // Ou use ConflictException
    }

    // Remove id_usuario from the data to avoid conflict with the relation
    const { id_usuario, ...moradorData } = createMoradorDto;

    return this.prisma.morador.create({
      data: {
        ...moradorData,
        data_cadastro: dataCadastro, // Usar o objeto Date
        usuario: { connect: { id_usuario: createMoradorDto.id_usuario } }, // Conecta ao usuário existente
      },
    });
  }

  async findAll() {
    return this.prisma.morador.findMany();
  }

  async findOne(id: number) {
    const morador = await this.prisma.morador.findUnique({
      where: { id_morador: id },
    });
    if (!morador) {
      throw new NotFoundException(`Morador com ID ${id} não encontrado.`);
    }
    return morador;
  }

  async update(id: number, updateMoradorDto: UpdateMoradorDto) {
    const morador = await this.prisma.morador.findUnique({
      where: { id_morador: id },
    });

    if (!morador) {
      throw new NotFoundException(
        `Morador com ID ${id} não encontrado para atualização.`,
      );
    }

    // Se 'data_cadastro' for atualizado, convertê-lo para Date
    const data: any = { ...updateMoradorDto };
    if (updateMoradorDto.data_cadastro) {
      data.data_cadastro = new Date(updateMoradorDto.data_cadastro);
    }
    // Se 'id_usuario' for atualizado, conectar ao usuário
    if (updateMoradorDto.id_usuario) {
      data.usuario = { connect: { id_usuario: updateMoradorDto.id_usuario } };
      delete data.id_usuario; // Remove o campo bruto para evitar conflito com 'connect'
    }

    return this.prisma.morador.update({
      where: { id_morador: id },
      data,
    });
  }

  async remove(id: number) {
    const morador = await this.prisma.morador.findUnique({
      where: { id_morador: id },
    });

    if (!morador) {
      throw new NotFoundException(
        `Morador com ID ${id} não encontrado para remoção.`,
      );
    }

    return this.prisma.morador.delete({
      where: { id_morador: id },
    });
  }
}
