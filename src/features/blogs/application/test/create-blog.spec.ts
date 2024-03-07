// import { INestApplication } from "@nestjs/common";
// import { Test, TestingModule } from "@nestjs/testing";
// import { AppModule } from "../../../../app.module";
// import { CreateBlogUseCase } from "../use-cases/create-blog-use-case";
// import { BlogsRepository } from "../../infrastructure/blogs.repository";
// import { Blogs } from "../../domain/blogs.entity";

// describe('Integration test for Create-blog-use-case', () => {
//   let app: INestApplication;

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   const createBlogUseCase =new CreateBlogUseCase(new BlogsRepository(@InjectModel(Blogs.name)),  @InjectModel(Blogs.name))

//   it('should create blog', async () => {
//     createBlogUseCase.execute()
//     expect(5).toBe(5);
//   });
// });
