import { TableTab } from 'src/views/CRUD/types';

export interface MaterialLibraryItem {
  title: string;
  size_in_bytes: string;
  url: string;
  published_at: string;
}

export interface MaterialLibraryFolder {
  title: string;
  items: MaterialLibraryItem[];
}

export interface MaterialLibraryData {
  folders: MaterialLibraryFolder[];
}

export interface MaterialDocument {
  id: string;
  title: string;
  category: string;
  size_in_bytes: number;
  url: string;
  published_at: string;
}

export const ALL_TAB = 'all' as const;

export const TAB_MAP: {
  [key in
    | typeof ALL_TAB
    | TableTab.Strategic
    | TableTab.Operating
    | TableTab.CompanyLevel]: string;
} = {
  [ALL_TAB]: 'Все материалы',
  [TableTab.Strategic]: 'Аналитический уровень',
  [TableTab.Operating]: 'Операционный уровень',
  [TableTab.CompanyLevel]: 'Уровень компании',
};

export type MaterialTab =
  | typeof ALL_TAB
  | TableTab.Strategic
  | TableTab.Operating
  | TableTab.CompanyLevel;

export const isMaterialTab = (tab: string): tab is MaterialTab => {
  return (
    tab === ALL_TAB ||
    tab === TableTab.Strategic ||
    tab === TableTab.Operating ||
    tab === TableTab.CompanyLevel
  );
};

export const BASKET_MAP: Record<string, string> = {
  [TableTab.Strategic]: 'Аналитический уровень',
  [TableTab.Operating]: 'Операционный уровень',
  [TableTab.CompanyLevel]: 'Уровень компании',
};
