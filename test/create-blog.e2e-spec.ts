// import { INestApplication } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';
// import { AppModule, options } from '../src/app.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Blogs } from '../src/features/blogs/domain/blogs.entity';
// import { CreateBlogCommand } from '../src/features/blogs/application/use-cases/create-blog-use-case';

// describe('Integration test for Create-blog-use-case', () => {
//   let app: INestApplication;

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule, TypeOrmModule.forRoot(options)],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });
//   const createdAt = new Date().toISOString();
//   const isMembership = false;
//   const newBlog = new Blogs();
//   newBlog.description = 'blogsCreateModel.description';
//   newBlog.websiteUrl = 'blogsCreateModel.websiteUrl';
//   newBlog.name = 'ddd';
//   newBlog.createdAt = createdAt;
//   newBlog.isMembership = isMembership;
//   // const createBlogUseCase =new CreateBlogCommand(newBlog: Blogs)

//   it('should create blog', async () => {
//     // createBlogUseCase.execute()
//     expect(5).toBe(5);
//   });
//   afterAll(async () => {
//     await app.close();
//   });
// });
// import { INestApplication } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';
// import { AppModule, options } from '../src/app.module';
// import {
//   CreateBlogCommand,
//   CreateBlogUseCase,
// } from '../src/features/blogs/application/use-cases/create-blog-use-case';
// import { BlogsRepository } from '../src/features/blogs/infrastructure/blogs.repository';
// import { Blogs } from '../src/features/blogs/domain/blogs.entity';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { BlogsCreateModel } from '../src/features/blogs/api/models/input/create-blog.input.model';

// describe('Integration test for Create-blog-use-case', () => {
//   let app: INestApplication;
//   let createBlogUseCase: CreateBlogUseCase;

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule, TypeOrmModule.forRoot(options)],
//       providers: [BlogsRepository, CreateBlogUseCase],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();

//     createBlogUseCase = moduleFixture.get<CreateBlogUseCase>(CreateBlogUseCase);
//   });

//   it('should create blog', async () => {
//     const createdAt = new Date().toISOString();
//     const isMembership = false;
//     const newBlog = new Blogs();
//     newBlog.description = 'blogsCreateModel.description';
//     newBlog.websiteUrl = 'blogsCreateModel.websiteUrl';
//     newBlog.name = 'ddd';
//     newBlog.createdAt = createdAt;
//     newBlog.isMembership = isMembership;

//     const createBlogCommand = new CreateBlogCommand(newBlog);

//     const result = await createBlogUseCase.execute(createBlogCommand);

//     expect(result).toBeDefined();
//     expect(result.name).toEqual(newBlog.name);
//     expect(result.description).toEqual(newBlog.description);
//     expect(result.websiteUrl).toEqual(newBlog.websiteUrl);
//     expect(result.createdAt).toEqual(newBlog.createdAt);
//     expect(result.isMembership).toEqual(newBlog.isMembership);
//   });
//   afterAll(async () => {
//     await app.close();
//   });
// });
