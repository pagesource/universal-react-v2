/**
 *
 * Button
 *
 */
// @flow

// Node_Module Imports
import React, { ComponentType } from 'react';
import styled from 'styled-components';

// Relative imports
import styles, { AppContainer } from './Button.style';

const Button = ({ className, children }) => <AppContainer className={className} data-testid='AppContainer'>{children}</AppContainer>;

Button.defaultProps = {};

const StyledButton = styled(Button)`
  ${styles};
`;

export default StyledButton;

export { Button };
