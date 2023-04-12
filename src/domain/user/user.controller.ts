import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpException,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@/shared/entities';

@ApiTags('user')
@Controller('/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponse({
    description: 'User has been created successfully',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: HttpException,
  })
  @HttpCode(201)
  @Post()
  async create(@Body() userDTO: CreateUserDto) {
    return this.userService.create(userDTO);
  }

  @ApiSecurity('bearer')
  @ApiOkResponse({
    description: 'User has been updated successfully',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: HttpException,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @HttpCode(200)
  @Put()
  async update(@Req() req: any, @Body() userDTO: UpdateUserDto) {
    return this.userService.update(req.user.id, userDTO);
  }

  @ApiSecurity('bearer')
  @ApiOkResponse({
    description: 'User has been deleted successfully',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: HttpException,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @HttpCode(200)
  @Delete()
  async delete(@Req() req: any) {
    return this.userService.delete(req.user.id);
  }
}
