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
          <Card.Body css={{ py: "$10" }}>
            <Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Text>
          </Card.Body>
          <Divider />
          <Card.Footer>
            <Row justify="flex-end">
              <Button size="sm" light>
                Cancel
              </Button>
              <Button size="sm">Agree</Button>
            </Row>
          </Card.Footer>
        </Card>
);

Modal.defaultProps = {};
export default Modal;
export { Modal };
