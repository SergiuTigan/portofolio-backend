export interface CreateBlogPostDto {
  title: string;
  content: string;
}

export interface UpdateBlogPostDto {
  title?: string;
  content?: string;
}
