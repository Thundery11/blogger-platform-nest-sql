// import { Test, TestingModule } from '@nestjs/testing';
// import { BlogsController } from '../src/features/blogs/api/blogs.controller';
// import { CreateBlogUseCase } from '../src/features/blogs/application/use-cases/create-blog-use-case';
// import { Blogs } from '../src/features/blogs/domain/blogs.entity';
// import { BlogsOutputModel } from '../src/features/blogs/api/models/output/blog.output.model';

// describe('BlogsController', () => {
//   let blogsController: BlogsController;
//   let createBlogUseCase: CreateBlogUseCase;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [BlogsController],
//       providers: [CreateBlogUseCase],
//     }).compile();

//     blogsController = module.get<BlogsController>(BlogsController);
//     createBlogUseCase = module.get<CreateBlogUseCase>(CreateBlogUseCase);
//   });

//   describe('createBlog', () => {
//     it('should create a new blog', async () => {
//       const newBlog = new Blogs();
//       newBlog.name = 'Test Blog';
//       newBlog.description = 'Test Description';
//       newBlog.websiteUrl = 'http://test.com';

//       const createdBlog = new BlogsOutputModel(); // Создаем объект BlogsOutputModel для сравнения
//       createdBlog.name = newBlog.name;
//       createdBlog.description = newBlog.description;
//       createdBlog.websiteUrl = newBlog.websiteUrl;

//       jest.spyOn(createBlogUseCase, 'execute').mockResolvedValue(createdBlog);

//       expect(await blogsController.createBlog(newBlog)).toEqual(createdBlog);
//     });
//   });
// });
