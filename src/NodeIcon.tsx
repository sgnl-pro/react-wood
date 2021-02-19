import React, { FC, HTMLAttributes } from 'react';
import cn from './utils/classNames';
import CarretSvg from './svg/CarretRight';
import './main.sass';

export interface INodeIconProps extends HTMLAttributes<HTMLDivElement> {
  isParent?: boolean;
  expanded?: boolean;
  iconClassName?: string;
}

export const NodeIcon: FC<INodeIconProps> = ({
  isParent,
  expanded,
  iconClassName,
  className,
  children,
  ...attrs
}) => {
  if (!children && !isParent) {
    return null;
  }
  return (
    <div className={cn('S-Tree-node__icon', className)} {...attrs}>
      {children || (
        <CarretSvg
          className={cn(
            'S-Tree-svg',
            expanded && 'S-Tree-svg_expanded',
            iconClassName
          )}
        />
      )}
    </div>
  );
};
