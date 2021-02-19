export interface ITreeItem {
  id: string;
  label: string;
  children?: ITreeItem[] | null;
}

export enum SelectionType {
  Child = 'child',
  Parent = 'parent',
  All = 'all',
  None = 'none',
}
