import { BlogsCreateModel } from '../../api/models/input/create-blog.input.model';

export class BlogCreatedEvent {
  constructor(
    public userId: number,
    public blogsCreateModel: BlogsCreateModel,
  ) {}
}
