import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { ResponseInterceptor } from './commons/interceptors/response.interceptor';
import { AppRoutes } from './app.routes';
import { LoggerModule } from './logger/logger.module';
import { TestModule } from './test/test.module';
import { ConsoleModule } from './portal/console/console.module';
import { WelcomeModule } from './portal/welcome/welcome.module';
import { RolesModule } from './portal/roles/roles.module';
import { Auth0Module } from './providers/auth0/auth0.module';
import { BucketModule } from './providers/bucket/bucket.module';
import { JwtModule } from '@nestjs/jwt';
import { HealthCheckModule } from './health-check/health-check.module';
import { AppConnectionsDatabases } from './app.database';
import { LeaveModule } from './leave/leave.module';
import { DiscordModule } from './discord/discord.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    ...AppConnectionsDatabases,
    AppRoutes,
    JwtModule,
    LoggerModule,
    TestModule,
    Auth0Module,
    BucketModule,
    WelcomeModule,
    ConsoleModule,
    RolesModule,
    HealthCheckModule,
    LeaveModule,
    DiscordModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    AppService,
  ],
  exports: [JwtModule],
})
export class AppModule {}
