/**
 *
 * Button
 *
 */
// @flow

// Node_Module Imports
import React from 'react';
import styled from 'styled-components';

// Relative imports
import styles, { AppContainer } from './Button.style';
import { ButtonProps } from './types';

const Button: React.FunctionComponent<ButtonProps> = ({ className, children }) => (
  <AppContainer className={className} data-testid="AppContainer">
    {children}
  </AppContainer>
);

Button.defaultProps = {};

const StyledButton = styled(Button)`
  ${styles};
`;

export default StyledButton;

export { Button };
