// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
// } from '@nestjs/common';
// import { Request, Response } from 'express';

// @Catch(HttpException)
// export class HttpExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//     const status = exception.getStatus();

//     if (status === 400) {
//       const errorResponse: { errorsMessages: any[] } = {
//         errorsMessages: [],
//       };
//       const responseBody: any = exception.getResponse();
//       console.log('responseBody', responseBody);
//       const message = Array.isArray(responseBody.message)
//         ? responseBody.message // Если сообщение об ошибке является массивом, используем его
//         : [responseBody.message]; // Иначе создаем массив из одного элемента
//       message.forEach((m) => errorResponse.errorsMessages.push(m));
//       //       responseBody.message.forEach((m) => errorResponse.errorsMessages.push(m));
//       response.status(status).json(errorResponse);
//     } else {
//       response.status(status).json({
//         statusCode: status,
//         timestamp: new Date().toISOString(),
//         path: request.url,
//       });
//     }
//   }
// }
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>(); // Получаем объект ответа
    const request = ctx.getRequest<Request>(); // Получаем объект запроса
    const status = exception.getStatus(); // Получаем статус ошибки

    // Если статус ошибки 400 (неверный запрос)
    if (status === 400) {
      const errorResponse: { errorsMessages: any[] } = {
        errorsMessages: [],
      };
      const responseBody: any = exception.getResponse(); // Получаем тело ответа об ошибке
      const messages = Array.isArray(responseBody.message)
        ? responseBody.message // Если сообщение об ошибке является массивом, используем его
        : [responseBody.message]; // Иначе создаем массив из одного элемента

      messages.forEach((m) => {
        // Если сообщение об ошибке является строкой, добавляем его как объект ошибки с пустым полем field
        if (typeof m === 'string') {
          errorResponse.errorsMessages.push({ message: m, field: m });
        } else {
          // Если сообщение об ошибке является объектом, добавляем его в массив ошибок
          errorResponse.errorsMessages.push(m);
        }
      });

      response.status(status).json(errorResponse);
    } else {
      // Если статус ошибки не 400, отправляем ответ без дополнительных данных об ошибке, только с основными данными о запросе
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}

// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
// } from '@nestjs/common';
// import { Request, Response } from 'express';

// @Catch(HttpException)
// export class HttpExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//     const status = exception.getStatus();

//     if (status === 400) {
//       const errorResponse: { errorsMessages: any[] } = {
//         errorsMessages: [],
//       };
//       const responseBody: any = exception.getResponse();
//       console.log('responseBody', responseBody);
//       responseBody.message.forEach((m) => errorResponse.errorsMessages.push(m));
//       response.status(status).json(errorResponse);
//     } else {
//       response.status(status).json({
//         statusCode: status,
//         timestamp: new Date().toISOString(),
//         path: request.url,
//       });
//     }
//   }
// }
