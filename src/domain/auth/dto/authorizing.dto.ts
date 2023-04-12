import { IsNotEmpty, IsString } from 'class-validator';

export class AuthorizingDTO {
  @IsString({ each: true })
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
