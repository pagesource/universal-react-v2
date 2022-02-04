/**
 *
 * Link
 *
 */
// @flow

// Node_Module Imports
import React, { ComponentType } from 'react';
import styled from 'styled-components';
import NextLink from 'next/link';

// Relative imports
import type { Props } from './types';
import styles from './Link.style';

const Link: React.FunctionComponent<Props> = ({ children, href, ...props }) => (
  <NextLink {...props} href={href} as={`${href}`}>
    {children}
  </NextLink>
);

Link.defaultProps = {};

const StyledLink: ComponentType<Props> = styled(Link)`
  ${styles};
`;

export default StyledLink;

export { Link };
