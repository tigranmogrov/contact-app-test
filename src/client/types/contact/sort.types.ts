import { SortCriterion, SortDirection } from '@/enums/sort.enum.ts';

export interface IContactSortOptions {
  id: number;
  value: {
    criterion: SortCriterion;
    direction: SortDirection;
  };
  title: string;
}
