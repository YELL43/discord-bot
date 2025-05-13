import { RouterModule } from '@nestjs/core';
import { Auth0Module } from './providers/auth0/auth0.module';
import { BucketModule } from './providers/bucket/bucket.module';
import { WelcomeModule } from './portal/welcome/welcome.module';
import { ConsoleModule } from './portal/console/console.module';
import { RolesModule } from './portal/roles/roles.module';
import { HealthCheckModule } from './health-check/health-check.module';

export const AppRoutes = RouterModule.register([
  {
    path: 'health-check',
    module: HealthCheckModule
  },
  {
    path: 'providers',
    children: [
      {
        path: 'auth0',
        module: Auth0Module,
      },
      {
        path: 'bucket',
        module: BucketModule,
      },
    ],
  },
  {
    path: 'portals',
    children: [
      {
        path: 'welcome',
        module: WelcomeModule,
      },
      {
        path: 'console',
        module: ConsoleModule,
      },
      {
        path: 'roles',
        module: RolesModule,
      },
    ],
  },
]);
