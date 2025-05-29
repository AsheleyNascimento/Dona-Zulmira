import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { RolesGuard } from '../auth/roles.guard';

@Controller('usuarios')
@UseGuards(RolesGuard)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async create(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @Req() req: { user: { funcao: string } },
  ) {
    const userRole = req.user.funcao; // Deve vir do token JWT
    return this.usuarioService.create(createUsuarioDto, userRole);
  }
}
