"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const fs = require("node:fs");
async function bootstrap() {
    const httpsOptions = {
        key: fs.readFileSync('/etc/letsencrypt/live/tigan.dev/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/tigan.dev/fullchain.pem'),
    };
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        httpsOptions,
    });
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.header('Access-Control-Allow-Credentials', 'true');
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
        next();
    });
    await app.listen(443);
}
bootstrap();
//# sourceMappingURL=main.js.map