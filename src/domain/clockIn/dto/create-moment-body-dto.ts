import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMomentDtoBody {
  @ApiProperty({
    description: 'Timestamp for the moment',
    example: '2023-04-12T21:04:45.044Z',
  })
  @IsString()
  @IsNotEmpty()
  readonly clockIn: string;
}
