import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { BlogsService } from '../../features/blogs/application/blogs.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    console.log(request.headers.authorization);

    return true;
  }
}
