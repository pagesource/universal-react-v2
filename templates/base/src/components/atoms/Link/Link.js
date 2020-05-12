/**
 *
 * Link
 *
 */
// @flow

// Node_Module Imports
import React, { ComponentType } from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import NextLink, { LinkProps } from 'next/link'

// Relative imports
import type { Props } from './types';
import styles from './Link.style';
import { BASE_PATH } from '../../../routes'

const Link: React.FunctionComponent<LinkProps> = ({ ...props, children, className }: Props): Node => (
  <NextLink
    {...props}
    as={`${BASE_PATH}${props.href}`}
    >
    {children}
  </NextLink>
);

Link.defaultProps = {};

const StyledLink: ComponentType<Props> = styled(Link)`
  ${styles};
`;

export default StyledLink;

export { Link };
