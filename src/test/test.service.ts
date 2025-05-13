import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginTestDto } from './dto/login-test.dto';
import { v4 } from 'uuid';

@Injectable()
export class TestService {

  constructor (
    private jwtService: JwtService,
  ) { }

  getSecretKey() {
    return 'secret_key';
  }

  async login(body: LoginTestDto) {
    if (body.username !== 'admin' || body.password !== '123') {
      throw new BadRequestException('username or password incorrect');
    }

    const payload = {
      uuidAccount: '999',
      username: body.username,
    }

    const token = await this.jwtService.signAsync(payload, {
      secret: this.getSecretKey(),
      expiresIn: '1d',
    });

    return {
      token
    };
  }
  
  findAll() {
    return [
      {
        user: 1
      },
      {
        user: 2
      }
    ];
  }

  async verifyToken(token: string) {
    try {
      const data = await this.jwtService.verifyAsync(token, {
        secret: this.getSecretKey(),
      });

      return data
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  create(createTestDto: any) {
    return 'This action adds a new test';
  }


  findOne(id: number) {
    return `This action returns a #${id} test`;
  }

  update(id: number, updateTestDto: any) {
    return `This action updates a #${id} test`;
  }

  remove(id: number) {
    return `This action removes a #${id} test`;
  }
}
