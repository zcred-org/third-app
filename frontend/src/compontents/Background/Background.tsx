import css from './Background.module.css';
import type { FC, HTMLAttributes } from 'react';
import { classNamesConcat } from '../../utils/class-names-concat.ts';

export const Background: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={classNamesConcat(css.root, className)}
    {...props}
  />
);
