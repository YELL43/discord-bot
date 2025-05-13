"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const bodyParser = require("body-parser");
const fliter_exception_1 = require("./commons/exceptions/fliter.exception");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new fliter_exception_1.FilterException());
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: common_1.VersioningType.URI,
    });
    const limitParser = process.env?.BODY_PARSER_LIMIT ?? '30MB';
    app.use(bodyParser.json({ limit: limitParser }));
    app.use(bodyParser.urlencoded({ limit: limitParser, extended: true }));
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map