import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Products from './Products';

describe('Products Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { id: 1, name: 'Product 1', description: 'Description 1', category: 'Category 1' },
            { id: 2, name: 'Product 2', description: 'Description 2', category: 'Category 2' },
          ]),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders products from API', async () => {
    render(<Products />);

    // Chờ và kiểm tra xem dữ liệu được hiển thị
    await waitFor(() => expect(screen.getByText('Product 1')).toBeInTheDocument());
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
  });
});
