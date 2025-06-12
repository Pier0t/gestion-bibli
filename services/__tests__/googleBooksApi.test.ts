import { GoogleBooksApi } from '../googleBooksApi';

// Mock fetch globally
(global as any).fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ items: [] })
  })
) as any;

test('searchByISBN returns null when no items', async () => {
  const book = await GoogleBooksApi.searchByISBN('123');
  expect(book).toBeNull();
});

