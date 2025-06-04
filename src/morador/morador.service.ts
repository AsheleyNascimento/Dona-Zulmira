import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Certifique-se de que o caminho está correto
import { CreateMoradorDto } from './dto/create-morador.dto';
import { UpdateMoradorDto } from './dto/update-morador.dto';

@Injectable()
export class MoradorService {
  constructor(private prisma: PrismaService) {}

  async create(createMoradorDto: CreateMoradorDto) {
    try {
      // Verifica se o CPF já está cadastrado
      const existingMorador = await this.prisma.morador.findUnique({
        where: { cpf: createMoradorDto.cpf },
      });

      if (existingMorador) {
        throw new ConflictException('CPF já cadastrado para outro morador.');
      }

      // Converte data_cadastro se necessário
      const dataCadastro = createMoradorDto.data_cadastro
        ? new Date(createMoradorDto.data_cadastro)
        : new Date(); // ou lance erro se for obrigatório

      // Desestruturação segura
      const { id_usuario, ...moradorData } = createMoradorDto;

      return await this.prisma.morador.create({
        data: {
          ...moradorData,
          data_cadastro: dataCadastro,
          usuario: {
            connect: {
              id_usuario: Number(id_usuario),
            },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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
