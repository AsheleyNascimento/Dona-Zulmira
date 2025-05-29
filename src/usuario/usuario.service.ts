import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Criar o db
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto, userRole: string) {
    if (userRole !== 'Administrador') {
      throw new ForbiddenException(
        'Apenas administradores podem criar usuários',
      );
    }

    const senhaHash = await bcrypt.hash(createUsuarioDto.senha, 10);

    return this.prisma.usuario.create({
      // Criar o db
      data: {
        nome_usuario: createUsuarioDto.nome_usuario,
        senha_hash: senhaHash,
        nome_completo: createUsuarioDto.nome_completo,
        cpf: createUsuarioDto.cpf,
        email: createUsuarioDto.email,
        funcao: createUsuarioDto.funcao,
        situacao: createUsuarioDto.situacao,
      },
    });
  }
}
