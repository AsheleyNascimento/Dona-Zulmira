import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateMoradorDto } from './dto/create-morador.dto';
import { UpdateMoradorDto } from './dto/update-morador.dto';
import { AuthGuard } from '@nestjs/passport'; // Para proteger as rotas
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'; // Opcional: para documentação com Swagger
import { PrismaService } from '../prisma/prisma.service';
import { ParseIntIdPipe } from '../app/common/pipes/parse-int-id.pipe';
import { MoradorService } from './morador.service';

@ApiTags('morador') // Opcional: para documentação com Swagger
@ApiBearerAuth() // Opcional: indica que a rota requer token JWT
@Controller('moradores')
@UseGuards(AuthGuard('jwt')) // Protege todas as rotas deste controlador com JWT
export class MoradorController {
  constructor(private readonly moradorService: MoradorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Retorna 201 Created
  create(@Body() createMoradorDto: CreateMoradorDto) {
    return this.moradorService.create(createMoradorDto);
  }

  @Get()
  findAll() {
    return this.moradorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntIdPipe) id: number) {
    return this.moradorService.findOne(+id); // O '+' converte a string do parâmetro para número
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMoradorDto: UpdateMoradorDto) {
    return this.moradorService.update(+id, updateMoradorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content para remoção bem-sucedida
  remove(@Param('id') id: string) {
    return this.moradorService.remove(+id);
  }
}
