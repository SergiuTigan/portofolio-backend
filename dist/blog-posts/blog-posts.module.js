"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPostsModule = void 0;
const common_1 = require("@nestjs/common");
const blog_posts_service_1 = require("./blog-posts.service");
const blog_posts_controller_1 = require("./blog-posts.controller");
const mongoose_1 = require("@nestjs/mongoose");
const blog_post_schema_1 = require("./schemas/blog-post.schema");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let BlogPostsModule = class BlogPostsModule {
};
exports.BlogPostsModule = BlogPostsModule;
exports.BlogPostsModule = BlogPostsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: blog_post_schema_1.BlogPost.name, schema: blog_post_schema_1.BlogPostSchema },
            ]),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'test123',
                    signOptions: { expiresIn: '24h' },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [blog_posts_controller_1.BlogPostsController],
        exports: [mongoose_1.MongooseModule],
        providers: [blog_posts_service_1.BlogPostsService],
    })
], BlogPostsModule);
//# sourceMappingURL=blog-posts.module.js.map