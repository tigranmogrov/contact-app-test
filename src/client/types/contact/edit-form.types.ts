import { EditFormEnum } from '@/enums/edit-form.enum.ts';

export interface IContactEditForm {
  label: string;
  name: string;
  value: string;
  initialValue: string;
  type: string;
  required: boolean;
}

export interface IContactCreateFormData {
  firstname: string;
  lastname: string;
  middlename?: string | undefined;
  telephone: string;
  email: string;
}

export interface IContactUpdateFormData extends Omit<IContactCreateFormData, 'telephone'> {}

export type UpdateContactEmitType = {
  status: EditFormEnum;
  close: boolean;
};

export interface IContactEditFormEmit {
  [key: string]: string;
}
