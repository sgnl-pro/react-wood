import { SelectionType } from '../types';

export const noop = function () {};

export const isSelectableItem = (
  selectionType: SelectionType,
  isParent: boolean
) =>
  selectionType === SelectionType.All ||
  (selectionType === SelectionType.Parent && isParent === true) ||
  (selectionType === SelectionType.Child && isParent === false);
