import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Criar o db
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

   // Defina o papel do usuário aqui, ou obtenha-o de algum lugar
  async create(createUsuarioDto: CreateUsuarioDto, userRole: string) {
    
    const senhaHash = await bcrypt.hash(createUsuarioDto.senha, 10);

    return this.prisma.usuario.create({
      // Criar o db
      data: {
        // Use the correct field names as defined in your Prisma schema
        // For example, if the field is 'username' instead of 'nome_usuario':
        //nome_completo: createUsuarioDto.nome_usuario,
        senha_hash: senhaHash,
        nome_completo: createUsuarioDto.nome_completo,
        //cpf: createUsuarioDto.cpf,
        email: createUsuarioDto.email,
        funcao: createUsuarioDto.funcao,
        situacao: createUsuarioDto.situacao,
      },
    });
  }

  async findAll() {
    return await this.prisma.usuario.findMany();
  }

  async findOne(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id_usuario: id },
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return this.prisma.usuario.update({
      where: { id_usuario: id },
      data: updateUsuarioDto,
    });
  }

  async remove(id: number) {
    return this.prisma.usuario.delete({
      where: { id_usuario: id },
    });
  }
}
