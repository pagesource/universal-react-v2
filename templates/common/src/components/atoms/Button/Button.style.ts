import { styled } from '@nextui-org/react';

const CompRoot = styled('button', {
  fontSize: '$3',
  color: '$fontColor',
  margin: '1em',
  padding: '0.25em 1em',
  border: '2px solid black',
  borderRadius: '$1',
  display: 'block',
  variants: {
    variation: {
      primary: {
        color: '$fontColor'
      },
      secondary: {
        background: 'green'
      }
    }
  }
});

export default CompRoot;
