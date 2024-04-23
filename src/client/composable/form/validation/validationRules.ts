import {
  emailValidator,
  numberValidator,
  requiredValidator
} from '@/composable/form/validation/validators.ts';
import type { IValidationRules } from '@/types';

export const createNewContactRules: IValidationRules = {
  firstname: [{ validator: requiredValidator }],
  lastname: [{ validator: requiredValidator }],
  telephone: [{ validator: requiredValidator }, { validator: numberValidator }],
  email: [{ validator: emailValidator }]
};

export const updateNewContactRules: IValidationRules = {
  firstname: [{ validator: requiredValidator }],
  lastname: [{ validator: requiredValidator }],
  email: [{ validator: emailValidator }]
};
