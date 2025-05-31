/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsEmail,
  IsBoolean,
  Matches,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsString()
  nome_usuario: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  senha: string; // será convertida em senha_hash no backend

  @IsNotEmpty()
  @IsString()
  nome_completo: string;

  @IsNotEmpty()
  @Matches(/^\d{11}$/, { message: 'CPF deve conter 11 dígitos numéricos' })
  cpf: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  funcao: string;

  @IsNotEmpty()
  @IsBoolean()
  situacao: boolean;
}
