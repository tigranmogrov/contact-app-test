import { regexp } from '@/composable/form/validation/regexp.ts';
import type { ValidatorReturnType } from '@/types';

export const requiredValidator = (value: string, field: string): ValidatorReturnType => {
  if (!value) {
    return `${field} is required`;
  }
  return null;
};

export const emailValidator = (value: string, field: string): ValidatorReturnType => {
  if (value && !regexp.email.test(value)) {
    return `${field} not a valid email address`;
  }
  return null;
};
export const numberValidator = (value: string, field: string): ValidatorReturnType => {
  if (!regexp.number.test(value)) {
    return `${field} should only have numbers`;
  }
  return null;
};
