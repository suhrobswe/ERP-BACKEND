import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

export function SwaggerSuccessResponse(response: object) {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        example: response,
      },
    }),
  );
}
