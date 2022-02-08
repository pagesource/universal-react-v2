// @flow

import type { ReactNode } from 'react';
import { LinkProps } from 'next/link';

export type Props = LinkProps & {
  children?: ReactNode;
};
