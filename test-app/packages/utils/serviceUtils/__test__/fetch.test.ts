import '@testing-library/jest-dom/extend-expect';
import { fetchWrapper, getContentServiceUrl, getDataServiceUrl } from '../index';

describe('Testing fetch wrapper', () => {
  test('Should have correctly formed Content urls with and without mock', () => {
    const contentURL = getContentServiceUrl('home');
    expect(contentURL).toEqual('https://jsonplaceholder.typicode.com/home/1');
    const contentURLMock = getContentServiceUrl('home', true);
    expect(contentURLMock).toEqual('/static/mock/home/1.json');
  });
  test('Should have correctly formed Data urls with and without mock', () => {
    const contentURL = getDataServiceUrl('todo');
    expect(contentURL).toEqual('https://jsonplaceholder.typicode.com/todos/1');
    const contentURLMock = getDataServiceUrl('todo', true);
    expect(contentURLMock).toEqual('/static/mock/todos/1.json');
  });
  test('Should be able to make API call', async () => {
    const response = {
      completed: false,
      id: 1,
      title: 'delectus aut autem',
      userId: 1
    };
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ json: () => Promise.resolve(response), ok: 1 })
        ) as jest.Mock
      );
    const url = 'https://jsonplaceholder.typicode.com/todos/1';
    return await fetchWrapper(url).then((data) => {
      expect(fetchMock).toHaveBeenCalledWith(url, expect.any(Object));
      expect(data).toMatchObject(response);
    });
  });
});
