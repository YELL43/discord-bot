import { Module } from '@nestjs/common';
import { Auth0Service } from './auth0.service';
import { Auth0Controller } from './auth0.controller';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TempAccessToken } from '../../entities/portals/temp-access-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TempAccessToken]),
    HttpModule, 
    JwtModule
  ],
  controllers: [Auth0Controller],
  providers: [Auth0Service],
  exports: [Auth0Service],
})
export class Auth0Module {}
