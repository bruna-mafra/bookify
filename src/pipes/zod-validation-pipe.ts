import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(
    private bodySchema: ZodSchema,
    private paramSchema?: ZodSchema,
  ) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      if (metadata.type === 'body') {
        return this.bodySchema.parse(value);
      } else if (metadata.type === 'param' && this.paramSchema) {
        return this.paramSchema.parse(value);
      } else {
        throw new BadRequestException('Invalid data format');
      }
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Zod validation failed',
          errors: fromZodError(error),
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
