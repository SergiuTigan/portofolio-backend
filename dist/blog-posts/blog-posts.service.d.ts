import { BlogPost, BlogPostDocument } from './schemas/blog-post.schema';
import { CreateBlogPostDto, UpdateBlogPostDto } from './schemas/blog-post.models';
import { Model } from 'mongoose';
export declare class BlogPostsService {
    private blogPostModel;
    constructor(blogPostModel: Model<BlogPostDocument>);
    getPosts(): Promise<BlogPost[]>;
    getPost(id: string): Promise<BlogPost>;
    createBlogPost(blogPost: CreateBlogPostDto): Promise<BlogPost>;
    updatePost(id: string, blogPost: UpdateBlogPostDto): Promise<BlogPost>;
    deletePost(id: string): string;
}
