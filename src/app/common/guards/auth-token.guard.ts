import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from '../../../auth/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../../../auth/auth.constants';

import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Não logado!');
    }

    try {
      interface JwtPayload {
        sub: string;
        [key: string]: any;
      }

      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        this.jwtConfiguration,
      );

      const pessoa = await this.prismaService.usuario.findFirst({
        where: {
          id_usuario: Number(payload.sub),
          situacao: true,
        },
      });

      if (!pessoa) {
        throw new UnauthorizedException('Usuário não autorizado!');
      }

      payload['pessoa'] = pessoa;
      request[REQUEST_TOKEN_PAYLOAD_KEY] = payload;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    return true;
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const autorization = request.headers?.authorization;

    if (!autorization || typeof autorization !== 'string') {
      return;
    }

    return autorization.split(' ')[1];
  }
}
