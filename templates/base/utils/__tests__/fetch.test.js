
import fetchMock from 'fetch-mock';
import { waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import executeAPICall from '../fetch';

test('returns result if array', async () => {
  const url = 'https://jsonplaceholder.typicode.com/todos/1';
  const response = {
    completed: false,
    id: 1,
    title: "delectus aut autem",
    userId: 1
  }
  fetchMock.mock(url, response);
  return await executeAPICall(url, {}).then(data => expect(data).toMatchObject(response));
})
