export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  genre?: string;
  publisher?: string;
  series?: string;
  seriesNumber?: number;
  theme?: string;
  pages?: number;
  publicationYear?: number;
  language?: string;
  description?: string;
  coverImage?: string;
  personalNotes?: string;
  personalRating?: number;
  isRead?: boolean;
  dateAdded: string;
  dateModified: string;
}

export interface BookFilter {
  searchTerm?: string;
  genre?: string;
  author?: string;
  series?: string;
  theme?: string;
  isRead?: boolean;
}

export interface BookSort {
  field: 'title' | 'author' | 'dateAdded' | 'publicationYear' | 'series' | 'genre';
  order: 'asc' | 'desc';
}

export interface GoogleBooksResponse {
  items?: GoogleBookItem[];
}

export interface GoogleBookItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    industryIdentifiers?: {
      type: string;
      identifier: string;
    }[];
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    publisher?: string;
    language?: string;
  };
}
