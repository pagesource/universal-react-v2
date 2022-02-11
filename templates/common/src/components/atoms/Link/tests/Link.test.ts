import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

it('Testing the Link Router', () => {
  expect(true).toBe(true);
});
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Router from 'next/router';
import Link from '../Link';
import '@testing-library/jest-dom/extend-expect';

jest.mock('next/router', () => ({ push: jest.fn() }));

const Test = () => {
  return (
    <>
      <a>Link</a>
    </>
  );
};

describe('Testing the Link Component', () => {
  it('Link Router renders', () => {
    const { getByText } = render(
      <Link href="test">
        <Test />
      </Link>
    );
    expect(getByText('Link')).toBeInTheDocument();
  });
});
