/**
 *
 * Button
 *
 */
// @flow

// Node_Module Imports
import { Card, Divider, Row, Text } from '@nextui-org/react';
import React from 'react';

// Relative imports
import { CompRoot } from './Modal.style';
import { ModalProps } from './types';
import Button from '../../atoms/Button'

const Modal: React.FunctionComponent<ModalProps> = ({ className, children }) => (
  <Card css={{ mw: "330px" }}>
          <Card.Header>
            <Text b>Card Title</Text>
          </Card.Header>
          <Divider />
          <Card.Body>
            <Text>
            This Modal is made up of nextui Card component and custom button component.
            </Text>
          </Card.Body>
          <Divider />
          <Card.Footer>
            <Row justify="flex-end">
              <Button>
                Cancel
              </Button>
              <Button>Agree</Button>
            </Row>
          </Card.Footer>
        </Card>
);

Modal.defaultProps = {};
export default Modal;
export { Modal };
