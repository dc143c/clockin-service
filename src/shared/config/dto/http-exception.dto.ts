import { ApiProperty } from '@nestjs/swagger';

export class HttpException extends Error {
  @ApiProperty({
    description: 'The HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'The timestamp of the error',
    example: '2020-12-31T23:59:59.999Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'The error message',
    example: 'Bad Request',
  })
  message: string;

  @ApiProperty({
    description: 'The path of the request',
    example: '/users',
  })
  path: string;
}
