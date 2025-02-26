export interface CreateBlogPostDto {
  title: string;
  content: string;
  images?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  comments: string[];
}

export interface UpdateBlogPostDto {
  title?: string;
  content?: string;
  images?: string[];
  tags?: string[];
  likes?: number;
  comments?: string[];
}
