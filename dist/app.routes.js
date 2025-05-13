"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
const core_1 = require("@nestjs/core");
const auth0_module_1 = require("./providers/auth0/auth0.module");
const bucket_module_1 = require("./providers/bucket/bucket.module");
const welcome_module_1 = require("./portal/welcome/welcome.module");
const console_module_1 = require("./portal/console/console.module");
const roles_module_1 = require("./portal/roles/roles.module");
const health_check_module_1 = require("./health-check/health-check.module");
exports.AppRoutes = core_1.RouterModule.register([
    {
        path: 'health-check',
        module: health_check_module_1.HealthCheckModule
    },
    {
        path: 'providers',
        children: [
            {
                path: 'auth0',
                module: auth0_module_1.Auth0Module,
            },
            {
                path: 'bucket',
                module: bucket_module_1.BucketModule,
            },
        ],
    },
    {
        path: 'portals',
        children: [
            {
                path: 'welcome',
                module: welcome_module_1.WelcomeModule,
            },
            {
                path: 'console',
                module: console_module_1.ConsoleModule,
            },
            {
                path: 'roles',
                module: roles_module_1.RolesModule,
            },
        ],
    },
]);
//# sourceMappingURL=app.routes.js.map