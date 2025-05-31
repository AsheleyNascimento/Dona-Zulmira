/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param' || metadata.data !== 'id') {
      return value;
    }

    const parsedValue = Number(value);
    if (isNaN(parsedValue)) {
      throw new BadRequestException(
        `Validacao ParsIntId falhou. Param "${value}" não é numérico!`,
      );
    }

    if (parsedValue < 0) {
      throw new BadRequestException(
        `Validacao ParsIntId falhou. Param "${value}" não é um número positivo!`,
      );
    }

    // Aula 48 Udemy
    //console.log('Pipe value: ', value);
    //console.log('Pipe metadata: ', metadata);

    //console.log('ParseIntIdPipe executado');
    return parsedValue;
  }
}
