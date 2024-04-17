import { Blogs } from '../../../domain/blogs.entity';

export class BlogFromDb {
  id: number;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}
export class BlogsOutputModel {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}
export class AllBlogsOutputModel {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogsOutputModel[];
}

export const BlogsOutputMapper = (blog: Blogs): BlogsOutputModel => {
  const outputModel = new BlogsOutputModel();
  outputModel.id = blog.id.toString();
  outputModel.name = blog.name;
  outputModel.description = blog.description;
  outputModel.websiteUrl = blog.websiteUrl;
  outputModel.createdAt = blog.createdAt;
  outputModel.isMembership = blog.isMembership;

  return outputModel;
};

export const allBlogsOutputMapper = (blogs: Blogs[]): BlogsOutputModel[] => {
  const allBlogsOutput = blogs.map((blog) => ({
    id: blog.id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  }));
  return allBlogsOutput;
};
