import useLocalizedContent from './useLocalizedContent';
import { renderHook } from '@testing-library/react-hooks';

describe('testing useLocalizedContentHook', () => {
  it('testing hooks initial render', () => {
    const { result } = renderHook(() => useLocalizedContent('test'));

    const [loading] = result.current;

    expect(loading).toBeFalsy();
  });
});
