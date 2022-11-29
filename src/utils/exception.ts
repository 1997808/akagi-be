import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

export const throwErr = (message: string) => {
  throw new Error(message);
};

export const httpError = (message: string) => {
  throw new HttpException(message, HttpStatus.BAD_REQUEST);
};

export const wsError = (message: string) => {
  throw new WsException(message);
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('hello');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}

@Catch(WsException)
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient() as WebSocket;
    const data = host.switchToWs().getData();
    const error = exception.getError();
    // exception instanceof WsException
    //   ? exception.getError()
    //   : exception.getResponse();
    console.log(error);
    const details = error instanceof Object ? { ...error } : { message: error };
    client.send(
      JSON.stringify({
        event: 'error',
        data: {
          id: (client as any).id,
          rid: data.rid,
          ...details,
        },
      }),
    );
  }
}
