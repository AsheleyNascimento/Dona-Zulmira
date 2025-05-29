import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { PrismaService } from '../prisma/prisma.service'; // Criar o db

describe('UsuarioService', () => {
  let service: UsuarioService;
  let prisma: PrismaService; // Criar o db

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuarioService, PrismaService],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve gerar hash da senha corretamente', async () => {
    const senha = 'senha123';
    const hash = await service['hashPassword'](senha);
    expect(hash).not.toBe(senha);
    expect(hash.length).toBeGreaterThan(20);
  });

  it('não deve permitir criar usuário se não for admin', async () => {
    const dto = {
      nome_usuario: 'joao',
      senha: '123456',
      nome_completo: 'João da Silva',
      cpf: '12345678901',
      email: 'joao@email.com',
      funcao: 'Médico',
      situacao: true,
    };

    await expect(service.create(dto, 'Médico')).rejects.toThrow();
  });
});
