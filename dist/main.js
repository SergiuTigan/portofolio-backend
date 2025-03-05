"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const fs = require("node:fs");
async function bootstrap() {
    const httpsOptions = {
        key: fs.readFileSync('/etc/letsencrypt/live/api.tigan.dev/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/api.tigan.dev/cert.pem'),
    };
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        httpsOptions,
    });
    app.use((req, res, next) => {
        const allowedOrigins = ['https://next.tigan.dev', 'http://localhost:4200'];
        const origin = req.headers.origin;
        if (allowedOrigins.includes(origin)) {
            res.header('Access-Control-Allow-Origin', origin);
        }
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