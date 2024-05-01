import { Test, TestingModule } from '@nestjs/testing';
import { BlogsController } from './blogs.controller';
import { CreateBlogUseCase } from '../application/use-cases/create-blog-use-case';
import { Blogs } from '../domain/blogs.entity';
import { BlogsOutputModel } from './models/output/blog.output.model';
import { BlogsRepository } from '../infrastructure/blogs.repository';

describe('BlogsController', () => {
  let blogsController: BlogsController;
  let createBlogUseCase: CreateBlogUseCase;
  let blogsRepository: BlogsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogsController],
      providers: [CreateBlogUseCase, BlogsRepository],
    }).compile();

    blogsController = module.get<BlogsController>(BlogsController);
    createBlogUseCase = module.get<CreateBlogUseCase>(CreateBlogUseCase);
    blogsRepository = module.get<BlogsRepository>(BlogsRepository);
  });

  describe('createBlog', () => {
    it('should create a new blog', async () => {
      const newBlog = new Blogs();
      newBlog.name = 'Test Blog';
      newBlog.description = 'Test Description';
      newBlog.websiteUrl = 'http://test.com';

      const createdBlog = new BlogsOutputModel(); // Создаем объект BlogsOutputModel для сравнения
      createdBlog.name = newBlog.name;
      createdBlog.description = newBlog.description;
      createdBlog.websiteUrl = newBlog.websiteUrl;

      jest.spyOn(createBlogUseCase, 'execute').mockResolvedValue(createdBlog);

      expect(await blogsController.createBlog(newBlog)).toEqual(createdBlog);
    });
  });
});
