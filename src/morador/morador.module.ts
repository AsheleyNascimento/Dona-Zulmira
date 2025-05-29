import { Module } from '@nestjs/common';
import { MoradorService } from './morador.service';
import { MoradorController } from './morador.controller';

@Module({
  controllers: [MoradorController],
  providers: [MoradorService],
})
export class MoradorModule {}
