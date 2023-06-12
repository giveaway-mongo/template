import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { getErrors } from '@common/utils/error';
import { ERROR_CODES, SERVER_ERROR } from '@common/constants/error';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    console.log('my error');
    if (typeof exception.getError() === 'string') {
      return {
        errors: getErrors({
          nonFieldErrors: [exception.getError() as string],
          errorCode: ERROR_CODES.BAD_REQUEST,
        }),
      };
    }

    return {
      errors: exception.getError(),
    };
  }
}

@Catch()
export class ServerExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    console.log(exception);

    return {
      errors: getErrors({
        nonFieldErrors: [SERVER_ERROR],
      }),
    };
  }
}
