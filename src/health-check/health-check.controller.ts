import { Controller, Get, Post } from '@nestjs/common';

@Controller()
export class HealthCheckController {

  @Get()
  findAll() {
    return {
      status: 'ok',
      mode: process.env?.ENV_MODE ?? 'NONE'
    };
  }

  @Post()
  getEnv() {
    return {
      status: process.env
    };
  }
}
