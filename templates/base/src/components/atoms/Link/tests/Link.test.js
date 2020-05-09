
import { shallow } from 'enzyme';
import 'jest-styled-components';

import Link from '../index';

describe('<Link />', () => {
  let LinkComponent = '';
  beforeEach(() => {
    LinkComponent = shallow(<Link>Test</Link>);
  });

  test('should render correctly', () => {
    expect(LinkComponent).toMatchSnapshot();
  });
});
