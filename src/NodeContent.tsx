import React, { FC, HTMLAttributes } from 'react';
import cn from './utils/classNames';
import './main.sass';

export const NodeContent: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...attrs
}) => (
  <div className={cn('S-Tree-node__content', className)} {...attrs}>
    {children}
  </div>
);
