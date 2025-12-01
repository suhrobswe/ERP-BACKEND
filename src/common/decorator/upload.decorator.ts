import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { multerOptions } from 'src/infrastructure/fileservice/multer.utils';

export function ApiImageFile(fieldName: string = 'file', required: boolean = false) {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, multerOptions)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: required ? [fieldName] : [],
        properties: {
          [fieldName]: {
            type: 'string',
            format: 'binary',
            description: 'Upload image file (jpg, jpeg, png)',
          },
        },
      },
    }),
  );
}