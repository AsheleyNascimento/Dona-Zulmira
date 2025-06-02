import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;


    console.log('Valor do context:', context);
    console.log('Valor de context.switchToHttp():', context.switchToHttp()); // Verifique se isso é nulo
    console.log('Valor da variável "request" (depois da linha):', request); // Isto deve ser um objeto, NUNCA undefined
    console.log('Valor de request.user:', request?.user); // Este pode ser undefined, mas 'request' não

    console.log('--- Debug RolesGuard ---');
    console.log('Objeto completo req.user no RolesGuard:', user); // OLHE AQUI!
    console.log('Valor de user?.funcao no RolesGuard:', user?.funcao); // OLHE AQUI!
    console.log('--- Fim Debug RolesGuard ---')

    if (user?.funcao !== 'Administrador') {
      throw new ForbiddenException('Acesso restrito a administradores');
    }

    return true;
  }
}
