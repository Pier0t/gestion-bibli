import { GoogleBooksResponse, Book } from '@/types/Book';
import { GOOGLE_BOOKS_API_BASE } from './config';

export class GoogleBooksApi {
  static async searchByISBN(isbn: string): Promise<Book | null> {
    try {
      const response = await fetch(`${GOOGLE_BOOKS_API_BASE}?q=isbn:${isbn}`);
      const data: GoogleBooksResponse = await response.json();
      
      if (data.items && data.items.length > 0) {
        return this.transformGoogleBookToBook(data.items[0]);
      }
      
      return null;
    } catch (error) {
      console.error('Error searching book by ISBN:', error);
      return null;
    }
  }

  static async searchBooks(query: string): Promise<Book[]> {
    try {
      const response = await fetch(`${GOOGLE_BOOKS_API_BASE}?q=${encodeURIComponent(query)}&maxResults=20`);
      const data: GoogleBooksResponse = await response.json();
      
      if (data.items) {
        return data.items.map(item => this.transformGoogleBookToBook(item));
      }
      
      return [];
    } catch (error) {
      console.error('Error searching books:', error);
      return [];
    }
  }

  private static transformGoogleBookToBook(item: any): Book {
    const volumeInfo = item.volumeInfo;
    
    return {
      id: '',
      title: volumeInfo.title || 'Titre inconnu',
      author: volumeInfo.authors?.join(', ') || 'Auteur inconnu',
      isbn: volumeInfo.industryIdentifiers?.find((id: any) => 
        id.type === 'ISBN_13' || id.type === 'ISBN_10'
      )?.identifier,
      genre: volumeInfo.categories?.join(', '),
      publisher: volumeInfo.publisher,
      pages: volumeInfo.pageCount,
      publicationYear: volumeInfo.publishedDate ? new Date(volumeInfo.publishedDate).getFullYear() : undefined,
      language: volumeInfo.language,
      description: volumeInfo.description,
      coverImage: volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:'),
      dateAdded: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    };
  }
}
