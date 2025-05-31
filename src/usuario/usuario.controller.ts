import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ParseIntIdPipe } from '../app/common/pipes/parse-int-id.pipe';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuario')
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

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntIdPipe) id: number) {
    return this.usuarioService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntIdPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntIdPipe) id: number) {
    return this.usuarioService.remove(+id);
  }
}
