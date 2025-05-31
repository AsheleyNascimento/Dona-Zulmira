import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from '../usuario/usuario.module';
import { MoradorModule } from '../morador/morador.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UsuarioModule, MoradorModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
