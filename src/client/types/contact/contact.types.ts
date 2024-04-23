import { SortCriterion, SortDirection } from '@/enums/sort.enum.ts';

export interface IContact {
  id: string;
  employeeId: string | null;
  personalization: IPersonalizationContact;
  telephone: ITelephoneContact;
  email: IEmailContact | null;
}

export interface IPersonalizationContact {
  name: INameContact;
  dateOfBirth?: string;
}

export interface INameContact {
  firstname: string;
  lastname: string;
  middlename?: string;
}

export interface ITelephoneContact {
  number: string;
}

export interface IEmailContact {
  address: string;
}

export interface IContactData {
  items: IContact[];
  total: number;
  size: number;
  last: number;
  fromPageNumber: number;
  toPageNumber: number;
}

export type ContactsQueryType = {
  fromPageNumber: number;
  toPageNumber: number;
  sorting: { direction: SortDirection; criterion: SortCriterion };
  isEmployee: boolean | null;
};
