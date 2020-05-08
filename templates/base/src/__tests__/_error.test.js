import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Error from '../pages/_error';

test('ErrorPage ', () => {
  let { container, getByText, rerender } = render(<Error statusCode={500} />)
  expect(getByText('An error 500 occurred on server')).toBeInTheDocument()
  expect(container.firstChild).toMatchInlineSnapshot(`
    <p>
      An error 500 occurred on server
    </p>
  `)
  // Change props
  rerender(<Error />)
  expect(getByText('An error occurred on client')).toBeInTheDocument()
  expect(container.firstChild).toMatchInlineSnapshot(`
    <p>
      An error occurred on client
    </p>
  `)
})
