import React, { FC, ReactNode } from 'react';
import cn from './utils/classNames';
import { ITreeItem, SelectAction, SelectionType } from './types';
import { TreeContextProvider } from './context/TreeContextProvider';
import { TreeNode } from './TreeNode';
import './main.sass';

export interface ITreeProps {
  nodes: ITreeItem[];
  /**
   * Тип элементов, доступных для выбора:
   * дочерние ('child'), родительские ('parent'), все ('all').
   * Для отключения возможности выбора используется свойство 'none' (установлено по-умолчанию).
   */
  selectionType?: SelectionType;
  /** Разрешен ли выбор нескольких элементов. */
  multipleSelection?: boolean;
  /**
   * Какое событие будет вызывать выбор элемента:
   * click - клик по тексту (клик по иконке будет вызывать раскрытие элемента);
   * check - изменение состояния чекбокса (клик по элементу будет вызывать его раскрытие).
   */
  selectAction?: SelectAction;
  /**
   * Отключить выбор для заданных элементов.
   */
  disabledIds?: ITreeItem['id'][];
  /** Класс контейнера дерева. */
  containerClassName?: string;
  /** Класс узла дерева. */
  nodeClassName?: string;
  /** Класс выбранного узла дерева. */
  nodeActiveClassName?: string;
  nodeContentClassName?: string;
  /** Класс контейнера иконки. */
  nodeIconBoxClassName?: string;
  /** Класс иконки. */
  nodeIconClassName?: string;
  /** Класс текста узла дерева. */
  nodeLabelClassName?: string;
  /** Функция, которая будет вызвана при открытии элемента. */
  onNodeExpand?: (node: ITreeItem) => void;
  /**
   * Функция, которая будет вызвана при выборе очередного элемента.
   * selectedNodes: массив выбранных в текущий момент элементов.
   */
  onSelect?: (selectedNodes: ITreeItem[]) => void;
  /** Функция для отрисовки элемента для выбора элементов. */
  renderCustomCheckbox?: (checked: boolean, onChange: () => void) => ReactNode;
  /** Функция для отрисовки дополнительных элементов внутри узла. */
  renderNodeData?: (node: ITreeItem, selected: boolean) => ReactNode;
  /** Функция для отрисовки иконки узла. */
  renderNodeIcon?: (
    expanded: boolean,
    selected: boolean,
    isParentEl: boolean,
    node: ITreeItem
  ) => ReactNode;
  /** Элемент для отображения загрузки. */
  loader?: ReactNode;
  /** Элемент для отображения отсутствия данных. */
  noData?: ReactNode;
}

export const Tree: FC<ITreeProps> = ({
  nodes,
  selectionType = SelectionType.None,
  multipleSelection = false,
  selectAction = 'click',
  disabledIds,
  containerClassName,
  nodeClassName,
  nodeActiveClassName,
  nodeContentClassName,
  nodeIconBoxClassName,
  nodeIconClassName,
  nodeLabelClassName,
  onNodeExpand,
  onSelect,
  renderCustomCheckbox,
  renderNodeData,
  renderNodeIcon,
  loader,
  noData,
  children,
}) => {
  const renderNode = (n: ITreeItem) => (
    <TreeNode
      key={n.id}
      item={n}
      selectionType={selectionType}
      selectOn={selectAction}
      className={nodeClassName}
      activeClassName={nodeActiveClassName}
      contentClassName={nodeContentClassName}
      iconBoxClassName={nodeIconBoxClassName}
      iconClassName={nodeIconClassName}
      labelClassName={nodeLabelClassName}
      renderCheckbox={renderCustomCheckbox}
      renderData={renderNodeData}
      renderIcon={renderNodeIcon}
      loader={loader}
    />
  );
  return (
    <TreeContextProvider
      selectionType={selectionType}
      multiSelect={multipleSelection}
      disabledIds={disabledIds}
      onSelect={onSelect}
      onExpand={onNodeExpand}
    >
      <div className={cn('S-Tree-container', containerClassName)}>
        {children}
        {!nodes?.length
          ? !children &&
            (noData || (
              <div className="S-Tree-info S-Tree-info_noData">No data</div>
            ))
          : nodes.map(renderNode)}
      </div>
    </TreeContextProvider>
  );
};
