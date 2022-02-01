
import { render, screen} from '@testing-library/react'

import Button from '../index';

describe('<Button />', () => {
  let ButtonComponent = '';
  beforeEach(() => {
    ButtonComponent = render(<Button>Test</Button>);
  });

  test('should render correctly', () => {
    expect(screen.getByTestId('AppContainer'));
  });
});
