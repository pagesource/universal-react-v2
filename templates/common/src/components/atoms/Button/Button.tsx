/**
 *
 * Button
 *
 */
// @flow

// Node_Module Imports
import React from "react";

// Relative imports
import CompRoot from "./Button.style";
import { ButtonProps } from "./types";

const Button: React.FunctionComponent<ButtonProps> = ({
  className,
  children,
  ...otherProps
}) => (
  <CompRoot className={className} data-testid="CompRoot" {...otherProps}>
    {children}
  </CompRoot>
);

Button.defaultProps = {};
export default Button;
export { Button };
