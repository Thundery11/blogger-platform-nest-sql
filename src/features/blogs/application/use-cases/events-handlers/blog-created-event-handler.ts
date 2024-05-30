import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BlogCreatedEvent } from '../../../domain/events/blog-created.event';

@EventsHandler(BlogCreatedEvent)
export class ReturnTrueWhenBlogsCreatedHandler
  implements IEventHandler<BlogCreatedEvent>
{
  async handle(event: BlogCreatedEvent) {
    const userId = event.userId;
    return true;
  }
}
