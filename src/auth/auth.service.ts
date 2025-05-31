import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    const usuario = await this.prisma.usuario.findFirst({
      where: {
        email: loginDto.email,
      },
      select: {
        id_usuario: true,
        email: true,
        senha_hash: true, // <-- necessário
        funcao: true,
        //nome_usuario: true,
        situacao: true, // <-- necessário para verificar se o usuário está ativo
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Pessoa não autorizada!');
    }

    if (!usuario) {
      throw new UnauthorizedException('Usuário não autorizado!');
    }
    if (usuario.situacao !== true) {
      throw new UnauthorizedException('Usuário não autorizado!');
    }

    const passwordIsValid = await this.hashingService.comparePassword(
      loginDto.senha_hash,
      usuario.senha_hash,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Senha inválida!');
    }

    if (!usuario.email) {
      throw new UnauthorizedException('Usuário sem e-mail cadastrado!');
    }
    return this.createTokens({
      id_usuario: usuario.id_usuario,
      email: usuario.email,
    });
  }

  private async createTokens(usuario: { id_usuario: number; email: string }) {
    const accessTokenPromise = this.signJwtAsync(
      usuario.id_usuario,
      this.jwtConfiguration.jwtTtl,
      { email: usuario.email },
    );

    const refreshTokenPromise = this.signJwtAsync(
      usuario.id_usuario,
      this.jwtConfiguration.jwtRefreshTtl,
    );

    const [accessToken, refreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async signJwtAsync<T>(sub: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        this.jwtConfiguration,
      );
      const usuario = await this.prisma.usuario.findUnique({
        where: {
          id_usuario: sub,
        },
      });

      if (!usuario || usuario.situacao !== true) {
        throw new UnauthorizedException('Usuário não autorizado!');
      }

      if (!usuario.email) {
        throw new UnauthorizedException('Usuário sem e-mail cadastrado!');
      }
      return this.createTokens({
        id_usuario: usuario.id_usuario,
        email: usuario.email,
      });
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
