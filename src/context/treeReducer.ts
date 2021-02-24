import { ITreeItem } from '../types';

type ID = ITreeItem['id'];
export interface ITreeState {
  expandedIds: Record<ID, boolean>;
  selectedNodes: Record<ID, ITreeItem | undefined>;
}
export const getInitialTreeState = (): ITreeState => ({
  expandedIds: Object.create(null),
  selectedNodes: Object.create(null),
});

export const actions = {
  toggleExpanded: (node: ITreeItem) =>
    ({
      type: 'TOGGLE_EXPANDED',
      node,
    } as const),
  toggleSelected: (node: ITreeItem, allowMultiple: boolean) =>
    ({
      type: 'TOGGLE_SELECTED',
      node,
      allowMultiple,
    } as const),
  setSelected: (nodes: ITreeItem[], fullUpdate: boolean) =>
    ({
      type: 'SET_SELECTED',
      nodes,
      fullUpdate,
    } as const),
};

type Actions = typeof actions;
type Action = ReturnType<Actions[keyof Actions]>;

export const treeReducer = (state: ITreeState, action: Action) => {
  switch (action.type) {
    case 'TOGGLE_EXPANDED': {
      const nodeId = action.node.id;
      const expanded = !state.expandedIds[nodeId];
      return {
        ...state,
        expandedIds: { ...state.expandedIds, [nodeId]: expanded },
      };
    }
    case 'TOGGLE_SELECTED': {
      const { node } = action;
      const selected = state.selectedNodes[node.id] !== undefined;
      let selectedNodes: ITreeState['selectedNodes'];
      if (action.allowMultiple) {
        selectedNodes = {
          ...state.selectedNodes,
          [node.id]: selected === true ? undefined : node,
        };
      } else {
        selectedNodes = { [node.id]: selected === true ? undefined : node };
      }
      return {
        ...state,
        selectedNodes,
      };
    }
    case 'SET_SELECTED': {
      const { nodes, fullUpdate } = action;
      let selectedNodes: ITreeState['selectedNodes'] = fullUpdate
        ? {}
        : { ...state.selectedNodes };
      nodes.forEach((n) => {
        selectedNodes[n.id] = n;
      });
      return {
        ...state,
        selectedNodes,
      };
    }

    default:
      return state;
  }
};
