import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((response) => {
        if (!response) {
          return {
            data: [],
          };
        }

        if (Array.isArray(response)) {
          response.forEach((el) => {
            el.userId && (el.userId = undefined);
            el.tournament && (el.tournament.userId = undefined);
          });
        }

        response.userId && (response.userId = undefined);

        return { data: response };
      }),
    );
  }
}
