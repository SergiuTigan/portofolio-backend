import { BlogPost, BlogPostDocument } from './schemas/blog-post.schema';
import { UpdateBlogPostDto } from './schemas/blog-post.models';
import { Model } from 'mongoose';
export declare class BlogPostsService {
    private blogPostModel;
    constructor(blogPostModel: Model<BlogPostDocument>);
    getPosts(): Promise<BlogPost[]>;
    getPost(id: string): string;
    createBlogPost(blogPost: BlogPost): string;
    updatePost(id: string, blogPost: UpdateBlogPostDto): string;
    deletePost(id: string): string;
}
