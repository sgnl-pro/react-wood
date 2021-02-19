import React, { FC, HTMLAttributes } from 'react';
import cn from './utils/classNames';
import './main.sass';

export const NodeLabel: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...attrs
}) => (
  <div className={cn('S-Tree-node__label', className)} {...attrs}>
    {children}
  </div>
);
