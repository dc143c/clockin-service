import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMomentDto {
  @ApiProperty({
    description: 'The author id',
    example: 'cdcv-fdbg-ghjg-ghjg',
  })
  @IsString()
  @IsNotEmpty()
  readonly author: string;
}
