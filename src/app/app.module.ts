import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from '../usuario/usuario.module';
import { MoradorModule } from '../morador/morador.module';

@Module({
  imports: [UsuarioModule, MoradorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
