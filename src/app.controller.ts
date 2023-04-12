import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @ApiResponse({
    status: 200,
    description: 'Application health status checked and functional.',
  })
  @ApiResponse({
    status: 404,
    description: 'Application not up or malfunctioning.',
  })
  getStatus() {
    return this.appService.getStatus();
  }
}
