import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';

export function SwaggerErrorResponse(response: object) {
  return applyDecorators(
    ApiBadRequestResponse({
      schema: {
        example: response,
      },
    }),
  );
}
