import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanySwaggerDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ example: 'IT', minLength: 1, maxLength: 50 })
  segment: string;
}
