import {
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Authorized } from './dto/authorized.dto';
import { HttpException } from '@/shared/config/dto/http-exception.dto';

@ApiSecurity('basic')
@ApiTags('authentication')
@Controller('/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: Authorized,
  })
  @ApiResponse({
    status: 404,
    description: 'User has not been found',
    type: HttpException,
  })
  async login(@Req() req: any): Promise<Authorized> {
    return this.authService.authCredentials(req.user);
  }
}
