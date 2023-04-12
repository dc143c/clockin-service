import { AuthorizationHelper } from './helpers';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/shared/entities';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private readonly authorizationHelper = new AuthorizationHelper();

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    const isPasswordValid = await this.authorizationHelper.ComparePassword(
      pass,
      user.password,
    );

    if (user && isPasswordValid) {
      return user;
    }

    return null;
  }

  async authCredentials(credentials: User): Promise<any> {
    const payload = { email: credentials.email, sub: credentials.id };
    return {
      accessToken: await this.jwtService.sign(payload),
      user: credentials,
    };
  }
}
