import { render } from '@testing-library/react-native';
import BookCard from '../BookCard';

const mockBook = {
  id: '1',
  title: 'Test Book',
  author: 'Author',
  dateAdded: '',
  dateModified: ''
} as any;

test('renders book title', () => {
  const { getByText } = render(<BookCard book={mockBook} />);
  expect(getByText('Test Book')).toBeTruthy();
});

