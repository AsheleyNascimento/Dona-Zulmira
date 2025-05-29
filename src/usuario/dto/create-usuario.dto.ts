/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsEmail,
  IsBoolean,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  nome_usuario: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsString()
  nome_completo: string;

  @Matches(/^\d{11}$/, { message: 'CPF deve conter 11 dígitos numéricos' })
  cpf: string;

  @IsEmail()
  email: string;

  @IsString()
  funcao: string; // Ex.: "Administrador", "Médico", etc.

  @IsBoolean()
  situacao: boolean;
}
