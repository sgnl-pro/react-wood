import React, { FC, ReactNode } from 'react';
import cn from './utils/classNames';
import { ITreeItem, SelectAction, SelectionType } from './types';
import { useTreeActions } from './context/useTreeActions';
import { useTreeState } from './context/useTreeState';
import { NodeContent } from './NodeContent';
import { NodeLabel } from './NodeLabel';
import { NodeIcon } from './NodeIcon';
import './main.sass';

const isSelectable = (selectionType: SelectionType, isParent: boolean) =>
  selectionType === SelectionType.All ||
  (selectionType === SelectionType.Parent && isParent === true) ||
  (selectionType === SelectionType.Child && isParent === false);

export interface ITreeNodeProps {
  item: ITreeItem;
  selectionType: SelectionType;
  selectOn: SelectAction;
  className?: string;
  activeClassName?: string;
  contentClassName?: string;
  iconBoxClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
  renderCheckbox?: (checked: boolean, onChange: () => void) => ReactNode;
  renderData?: (node: ITreeItem, selected: boolean) => ReactNode;
  renderIcon?: (
    expanded: boolean,
    selected: boolean,
    isParent: boolean,
    node: ITreeItem
  ) => ReactNode;
  loader?: ReactNode;
}

export const TreeNode: FC<ITreeNodeProps> = ({
  item,
  selectionType,
  selectOn,
  className,
  activeClassName,
  contentClassName,
  iconBoxClassName,
  iconClassName,
  labelClassName,
  renderCheckbox,
  renderData,
  renderIcon,
  loader,
  children,
}) => {
  const { toggleExpanded, toggleSelected } = useTreeActions();
  const { expandedIds, selectedNodes } = useTreeState();

  const isParent = item.children !== void 0;
  const expanded = expandedIds?.[item.id] === true;
  const selected = selectedNodes?.[item.id] !== undefined;
  const withCheckbox = selectOn === 'check';
  const selectable = isSelectable(selectionType, isParent);

  const onNodeClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    if (withCheckbox || selectable === false) {
      toggleExpanded(item, expanded);
    } else {
      toggleSelected(item);
    }
  };

  const onIconClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    toggleExpanded(item, expanded);
  };

  const renderChecker = (): ReactNode => {
    if (withCheckbox && selectable === true) {
      const onCheck = () => {
        toggleSelected(item);
      };
      if (typeof renderCheckbox === 'function') {
        return renderCheckbox(selected, onCheck);
      } else {
        return (
          <input
            type="checkbox"
            checked={selected}
            onChange={onCheck}
            onClick={(e) => e.stopPropagation()}
          />
        );
      }
    }
    return null;
  };

  const renderNode = (n: ITreeItem) => (
    <TreeNode
      key={n.id}
      item={n}
      selectionType={selectionType}
      selectOn={selectOn}
      className={className}
      activeClassName={activeClassName}
      contentClassName={contentClassName}
      iconBoxClassName={iconBoxClassName}
      iconClassName={iconClassName}
      labelClassName={labelClassName}
      renderCheckbox={renderCheckbox}
      renderData={renderData}
      renderIcon={renderIcon}
      loader={loader}
    />
  );

  return (
    <div
      className={cn(
        'S-Tree-node',
        className,
        selected === true && ['S-Tree-node_selected', activeClassName]
      )}
    >
      <NodeContent className={contentClassName} onClick={onNodeClick}>
        <NodeIcon
          isParent={isParent}
          expanded={expanded}
          className={iconBoxClassName}
          iconClassName={iconClassName}
          onClick={onIconClick}
        >
          {typeof renderIcon === 'function' &&
            renderIcon(expanded, selected, isParent, item)}
        </NodeIcon>
        {renderChecker()}
        <NodeLabel className={labelClassName}>{item.label}</NodeLabel>
        {typeof renderData === 'function' && renderData(item, selected)}
      </NodeContent>
      {children}
      {isParent &&
        expanded &&
        (Array.isArray(item.children)
          ? item.children.map(renderNode)
          : loader || (
              <div className="S-Tree-info S-Tree-info_loading">...</div>
            ))}
    </div>
  );
};
