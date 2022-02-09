import useLocalizedContent from './useLocalizedContent';
import { renderHook } from '@testing-library/react-hooks';
import * as helper from '../helper';

class LocalStorageMock {
  store: Record<string, string>;
  length: number;
  key: (index: number) => string;
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}

const testURL = 'test';
const testEnglishUK = 'en_uk';

describe('Testing the useLocalizedContent Hook', () => {
  const unMockedLocalStorage = global.localStorage;

  global.localStorage = new LocalStorageMock();

  afterAll(() => {
    global.localStorage = unMockedLocalStorage;
    jest.clearAllMocks();
  });

  it('testing hooks initial render', () => {
    const { result } = renderHook(() => useLocalizedContent(testURL));

    const [loading] = result.current;

    expect(loading).toBeFalsy();
  });

  it('Testing getCacheKey function', () => {
    const result = helper.getCacheKey(testEnglishUK, testURL).split('_').pop();
    expect(result).toBe(testURL);
  });

  it('Testing getLanguageFromLocalStorage function', () => {
    localStorage.setItem(helper.languageStorageKey, testEnglishUK);
    const result = helper.getLanguageFromLocalStorage();
    expect(result).toBe(testEnglishUK);
  });
});
