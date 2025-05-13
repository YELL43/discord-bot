import { Controller, Get, Post, Body, Patch, Param, Delete, Req, BadRequestException, Query } from '@nestjs/common';
import { TestService } from './test.service';
import { LoginTestDto } from './dto/login-test.dto';
import { v4 } from 'uuid';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  findAll() {
    return this.testService.findAll();
  }

  @Post('login')
  async login(@Body() body: LoginTestDto) {
    return await this.testService.login(body);
  }

  @Post('verify-token')
  async verify(@Req() req: Request) {
    const request = req?.headers['authorization']?.split(' ');
    if(!request || !request[1]) {
      throw new BadRequestException('Request bearer token');
    }

    return await this.testService.verifyToken(request[1]);
  }

  @Post('create/:id')
  async create(
    @Req() req: Request, 
    @Param('id') id: string, 
    @Query() q: any,
    @Body() body: any
  ) {
    const payload = await this.verify(req);

    return { 
      payloadHeader: payload,
      pathParams: {
        id
      },
      queryParams: q,
      bodyRequest: body
    };
  }

  @Post('uuid')
  createUuid(@Body() uuid: any) {
    return uuid;
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestDto: any) {
    return this.testService.update(+id, updateTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testService.remove(+id);
  }
}
