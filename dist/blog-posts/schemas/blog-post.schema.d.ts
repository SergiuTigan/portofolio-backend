import { HydratedDocument } from 'mongoose';
export type BlogPostDocument = HydratedDocument<BlogPost>;
export declare class BlogPost {
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    likes: number;
    comments: string[];
    tags: string[];
    images: string[];
}
export declare const BlogPostSchema: import("mongoose").Schema<BlogPost, import("mongoose").Model<BlogPost, any, any, any, import("mongoose").Document<unknown, any, BlogPost> & BlogPost & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BlogPost, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<BlogPost>> & import("mongoose").FlatRecord<BlogPost> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
