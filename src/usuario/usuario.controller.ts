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
import { RolesGuard } from '../app/common/guards/roles.guard';
import { ParseIntIdPipe } from '../app/common/pipes/parse-int-id.pipe';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthTokenGuard } from '../app/common/guards/auth-token.guard';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../auth/auth.constants';

@Controller('usuario')
@UseGuards(AuthTokenGuard)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get('me')
  getProfile(@Req() req: Request) {
    const user = req[REQUEST_TOKEN_PAYLOAD_KEY];
    return user.pessoa; // Dados da pessoa já populados no guard
  }

  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    console.log(createUsuarioDto);
    //const userRole = req.user.funcao; // Deve vir do token JWT
    return this.usuarioService.create(createUsuarioDto);
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
