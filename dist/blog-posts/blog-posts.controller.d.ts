import { BlogPostsService } from './blog-posts.service';
import { CreateBlogPostDto, UpdateBlogPostDto } from './schemas/blog-post.models';
import { BlogPost } from './schemas/blog-post.schema';
export declare class BlogPostsController {
    private readonly postsService;
    constructor(postsService: BlogPostsService);
    findAll(): Promise<BlogPost[]>;
    findOne(id: string): string;
    create(createPostDto: CreateBlogPostDto): string;
    update(id: string, updatePostDto: UpdateBlogPostDto): string;
    remove(id: string): void;
}
