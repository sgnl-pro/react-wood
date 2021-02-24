import React, { FC, useEffect, useMemo, useReducer } from 'react';
import { ITreeItem, SelectionType } from '../types';
import { isSelectableItem } from '../utils';
import { TreeEventEmitter } from '../TreeEventEmitter';
import { treeStateContext, treeActionsContext } from './treeContext';
import { actions, getInitialTreeState, treeReducer } from './treeReducer';

interface ITreeContextProps {
  selectionType: SelectionType;
  multiSelect: boolean;
  disabledIds?: ITreeItem['id'][];
  eventEmitter?: TreeEventEmitter;
  onExpand?: (node: ITreeItem) => void;
  onSelect?: (selectedNodes: ITreeItem[]) => void;
}

export const TreeContextProvider: FC<ITreeContextProps> = ({
  selectionType,
  multiSelect,
  disabledIds,
  eventEmitter,
  onExpand,
  onSelect,
  children,
}) => {
  const [state, dispatch] = useReducer(treeReducer, getInitialTreeState());

  const treeActions = useMemo(
    () => ({
      toggleExpanded(item: ITreeItem, isExpanded: boolean) {
        if (item.children === void 0) return;
        dispatch(actions.toggleExpanded(item));
        if (!isExpanded && typeof onExpand === 'function') onExpand(item);
      },
      toggleSelected(item: ITreeItem) {
        if (selectionType === SelectionType.None) return;
        if (!isSelectableItem(selectionType, item.children !== void 0)) return;
        if (disabledIds?.includes(item.id)) return;
        dispatch(actions.toggleSelected(item, multiSelect));
      },
    }),
    [dispatch, onExpand, selectionType, multiSelect, disabledIds]
  );

  useEffect(() => {
    if (typeof onSelect === 'function') {
      onSelect(
        Object.values(state.selectedNodes).filter(
          (item) => item !== undefined
        ) as ITreeItem[]
      );
    }
  }, [state.selectedNodes, onSelect]);

  useEffect(() => {
    if (
      eventEmitter === undefined ||
      eventEmitter instanceof TreeEventEmitter === false
    ) {
      return;
    }
    const selectUnsubscribe = eventEmitter.on(
      'select',
      (items, type = 'merge') => {
        if (selectionType === SelectionType.None) return;
        const validItems: ITreeItem[] = [];
        for (let i = 0; i < items.length; i++) {
          if (multiSelect !== true && validItems.length > 0) break;
          if (!items[i].id || typeof items[i].label !== 'string') continue;
          if (!isSelectableItem(selectionType, items[i].children !== void 0))
            continue;
          if (disabledIds?.includes(items[i].id)) continue;
          validItems.push(items[i]);
        }
        dispatch(actions.setSelected(validItems, type === 'update'));
      }
    );
    return () => {
      selectUnsubscribe();
    };
  }, [eventEmitter, selectionType, disabledIds, multiSelect]);

  return (
    <treeActionsContext.Provider value={treeActions}>
      <treeStateContext.Provider value={state}>
        {children}
      </treeStateContext.Provider>
    </treeActionsContext.Provider>
  );
};
