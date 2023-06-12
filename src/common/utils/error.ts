import { Error, FieldError } from '@protogen/common/common';
import { ERROR_CODES } from '@common/constants/error';

const defaultFieldErrors = [];
const defaultNonFieldErrors = [];

export const getFieldErrors = (
  newFieldErrors: FieldError[],
  fieldErrors: FieldError[] = defaultFieldErrors,
) => {
  return [...fieldErrors, ...newFieldErrors];
};

export const getNonFieldErrors = (
  newNonFieldError: string,
  nonFieldErrors: string[] = defaultNonFieldErrors,
) => {
  return [...nonFieldErrors, newNonFieldError];
};

export const getErrors = (
  {
    fieldErrors = defaultFieldErrors,
    nonFieldErrors = defaultNonFieldErrors,
    errorCode = ERROR_CODES.SERVER_ERROR,
  }: Partial<Error> = {
    fieldErrors: defaultFieldErrors,
    nonFieldErrors: defaultNonFieldErrors,
    errorCode: ERROR_CODES.SERVER_ERROR,
  },
): Error => {
  return { fieldErrors, nonFieldErrors, errorCode };
};
