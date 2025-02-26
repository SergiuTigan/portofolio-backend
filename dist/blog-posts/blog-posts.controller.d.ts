import { BlogPostsService } from './blog-posts.service';
import { CreateBlogPostDto, UpdateBlogPostDto } from './schemas/blog-post.models';
import { BlogPost } from './schemas/blog-post.schema';
export declare class BlogPostsController {
    private readonly postsService;
    constructor(postsService: BlogPostsService);
    findAll(): Promise<BlogPost[]>;
    findOne(id: string): Promise<BlogPost>;
    create(createPostDto: CreateBlogPostDto): Promise<BlogPost>;
    update(id: string, updatePostDto: UpdateBlogPostDto): Promise<BlogPost>;
    remove(id: string): string;
}
