import { BlogsDocument } from '../../../domain/blogs.entity';

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

export const BlogsOutputMapper = (blog: BlogFromDb[]): BlogsOutputModel => {
  const outputModel = blog.map((b) => ({
    id: b.id.toString(),
    name: b.name,
    description: b.description,
    websiteUrl: b.websiteUrl,
    createdAt: b.createdAt,
    isMembership: b.isMembership,
  }))[0];
  return outputModel;
};

export const allBlogsOutputMapper = (
  blogs: BlogFromDb[],
): BlogsOutputModel[] => {
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
