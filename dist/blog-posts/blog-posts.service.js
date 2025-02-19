"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPostsService = void 0;
const common_1 = require("@nestjs/common");
const blog_post_schema_1 = require("./schemas/blog-post.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let BlogPostsService = class BlogPostsService {
    constructor(blogPostModel) {
        this.blogPostModel = blogPostModel;
    }
    getPosts() {
        return this.blogPostModel.find().exec();
    }
    getPost(id) {
        return `One post with id: ${id}`;
    }
    createBlogPost(blogPost) {
        return 'Created blog post with title: ' + blogPost.title;
    }
    updatePost(id, blogPost) {
        return 'Updated post with id: ' + id + ' and title: ' + blogPost.title;
    }
    deletePost(id) {
        return 'Delete post, id: ' + id;
    }
};
exports.BlogPostsService = BlogPostsService;
exports.BlogPostsService = BlogPostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(blog_post_schema_1.BlogPost.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BlogPostsService);
//# sourceMappingURL=blog-posts.service.js.map