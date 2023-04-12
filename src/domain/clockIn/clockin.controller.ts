import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClockInService } from './clockIn.service';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOkResponse,
  ApiParam,
  ApiSecurity,
  ApiTags,
  PartialType,
} from '@nestjs/swagger';
import { Moment } from '@/shared/entities';
import { HttpException } from '@/shared/config/dto/http-exception.dto';
import { Relatory } from './dto/relatory.dto';
import { AuthGuard } from '@nestjs/passport';
import { DeleteResult } from 'typeorm';
import * as moment from 'moment';
import { CreateMomentDtoBody } from './dto/create-moment-body-dto';

@ApiSecurity('bearer')
@ApiTags('batidas')
@Controller()
export class ClockinController {
  constructor(private service: ClockInService) {}

  @ApiOkResponse({
    description: 'The record has been successfully created.',
    type: Moment,
  })
  @ApiForbiddenResponse({
    description: 'Business exception has been found.',
    type: HttpException,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @ApiBody({
    description: 'Momento da batida',
    type: CreateMomentDtoBody,
  })
  @Post('/v1/batidas')
  @UseGuards(AuthGuard('jwt'))
  async clockIn(
    @Req() request: any,
    @Body() momentDTO: CreateMomentDtoBody,
  ): Promise<Moment> {
    return this.service.create({
      author: request.user.id,
      createdAt: moment(momentDTO.clockIn).toDate(),
    });
  }

  @ApiOkResponse({
    description: 'The record has been successfully created.',
    type: Relatory,
  })
  @ApiParam({
    name: 'mes',
    description: 'Mês para gerar o relatório. Ex: 2021-01',
    type: String,
  })
  @Get('/v1/folhas-de-ponto/:mes')
  @UseGuards(AuthGuard('jwt'))
  async generateRelatory(
    @Param('mes') mes: string,
    @Req() request: any,
  ): Promise<Relatory> {
    return this.service.findAllFromMonthByUser(mes, request.user.id);
  }

  @Delete('/v1/batidas')
  async deleteAll(): Promise<DeleteResult> {
    return this.service.deleteAll();
  }
}
