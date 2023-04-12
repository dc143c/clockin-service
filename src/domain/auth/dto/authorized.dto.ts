import { User } from '@/shared/entities';
import { ApiProperty } from '@nestjs/swagger';

export class Authorized {
  @ApiProperty({
    description: 'The access token',
  })
  accessToken: string;
  @ApiProperty({
    description: 'The user',
    type: User,
  })
  user: User;
}
