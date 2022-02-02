import useLocalizedContent from '.';
import { act, renderHook } from '@testing-library/react-hooks';

describe('base test', () => {
  it('testing hooks initial render', () => {
    const { result } = renderHook(() => useLocalizedContent('test'));

    const [loading] = result.current;

    expect(loading).toBeTruthy();
  });
});
