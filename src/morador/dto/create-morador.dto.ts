import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateMoradorDto {
  @IsNotEmpty({ message: 'O nome completo é obrigatório.' })
  @IsString({ message: 'O nome completo deve ser uma string.' })
  nome_completo: string;

  @IsNotEmpty({ message: 'O ID do usuário é obrigatório.' })
  @IsInt({ message: 'O ID do usuário deve ser um número inteiro.' })
  @Type(() => Number) // Garante que o valor seja transformado em número, se vier como string
  id_usuario: number;

  @IsNotEmpty({ message: 'A data de cadastro é obrigatória.' })
  @IsDateString(
    {},
    {
      message:
        'A data de cadastro deve ser uma data válida (formato YYYY-MM-DD).',
    },
  )
  data_cadastro: string; // Manter como string para validação de formato, converter no serviço se necessário

  @IsNotEmpty({ message: 'O CPF é obrigatório.' })
  @IsString({ message: 'O CPF deve ser uma string.' })
  @Length(11, 11, { message: 'O CPF deve ter exatamente 11 caracteres.' })
  @Matches(/^\d{11}$/, { message: 'O CPF deve conter apenas números.' })
  cpf: string;

  @IsNotEmpty({ message: 'O RG é obrigatório.' })
  @IsString({ message: 'O RG deve ser uma string.' })
  rg: string;

  @IsNotEmpty({ message: 'A situação é obrigatória.' })
  @IsString({ message: 'A situação deve ser uma string.' })
  // Opcional: Se 'situacao' tiver valores fixos, use @IsEnum
  // Ex: @IsEnum(['Ativo', 'Inativo', 'Outro'], { message: 'Situação inválida.' })
  situacao: string;
}
