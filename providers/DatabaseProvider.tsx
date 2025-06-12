import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import * as SQLite from 'expo-sqlite';
import { Book, BookFilter, BookSort } from '@/types/Book';

interface DatabaseContextType {
  books: Book[];
  addBook: (book: Omit<Book, 'id' | 'dateAdded' | 'dateModified'>) => Promise<void>;
  updateBook: (id: string, book: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  getBook: (id: string) => Book | undefined;
  searchBooks: (filter: BookFilter, sort?: BookSort) => Book[];
  isLoading: boolean;
  refreshBooks: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    initDatabase();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const initDatabase = async () => {
    try {
      const database = await SQLite.openDatabaseAsync('bookscope.db');
      
      if (!isMountedRef.current) return;
      
      setDb(database);
      
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS books (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          author TEXT NOT NULL,
          isbn TEXT,
          genre TEXT,
          publisher TEXT,
          series TEXT,
          seriesNumber INTEGER,
          theme TEXT,
          pages INTEGER,
          publicationYear INTEGER,
          language TEXT,
          description TEXT,
          coverImage TEXT,
          personalNotes TEXT,
          personalRating INTEGER,
          isRead INTEGER DEFAULT 0,
          dateAdded TEXT NOT NULL,
          dateModified TEXT NOT NULL
        );
      `);

      await refreshBooks();
    } catch (error) {
      console.error('Error initializing database:', error);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const refreshBooks = async () => {
    if (!db || !isMountedRef.current) return;
    
    try {
      const result = await db.getAllAsync('SELECT * FROM books ORDER BY dateAdded DESC') as any[];
      const booksData = result.map(row => ({
        ...row,
        isRead: row.isRead === 1,
      })) as Book[];
      
      if (isMountedRef.current) {
        setBooks(booksData);
      }
    } catch (error) {
      console.error('Error refreshing books:', error);
    }
  };

  const addBook = async (bookData: Omit<Book, 'id' | 'dateAdded' | 'dateModified'>) => {
    if (!db || !isMountedRef.current) return;

    const id = Date.now().toString();
    const now = new Date().toISOString();
    
    const book: Book = {
      ...bookData,
      id,
      dateAdded: now,
      dateModified: now,
    };

    try {
      await db.runAsync(
        `INSERT INTO books (
          id, title, author, isbn, genre, publisher, series, seriesNumber, 
          theme, pages, publicationYear, language, description, coverImage, 
          personalNotes, personalRating, isRead, dateAdded, dateModified
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          book.id, book.title, book.author, book.isbn, book.genre, book.publisher, 
          book.series, book.seriesNumber, book.theme, book.pages, book.publicationYear, 
          book.language, book.description, book.coverImage, book.personalNotes, 
          book.personalRating, book.isRead ? 1 : 0, book.dateAdded, book.dateModified
        ]
      );
      
      await refreshBooks();
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const updateBook = async (id: string, bookData: Partial<Book>) => {
    if (!db || !isMountedRef.current) return;

    const now = new Date().toISOString();
    const updates = { ...bookData, dateModified: now };
    
    const fields = Object.keys(updates).filter(key => key !== 'id');
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => {
      const value = updates[field as keyof Book];
      return field === 'isRead' ? (value ? 1 : 0) : value;
    });

    try {
      await db.runAsync(
        `UPDATE books SET ${setClause} WHERE id = ?`,
        [...values, id]
      );
      
      await refreshBooks();
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const deleteBook = async (id: string) => {
    if (!db || !isMountedRef.current) return;

    try {
      await db.runAsync('DELETE FROM books WHERE id = ?', [id]);
      await refreshBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const getBook = (id: string): Book | undefined => {
    return books.find(book => book.id === id);
  };

  const searchBooks = (filter: BookFilter, sort?: BookSort): Book[] => {
    let filteredBooks = [...books];

    // Apply filters
    if (filter.searchTerm) {
      const searchTerm = filter.searchTerm.toLowerCase();
      filteredBooks = filteredBooks.filter(book =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.description?.toLowerCase().includes(searchTerm) ||
        book.series?.toLowerCase().includes(searchTerm)
      );
    }

    if (filter.genre) {
      filteredBooks = filteredBooks.filter(book => book.genre === filter.genre);
    }

    if (filter.author) {
      filteredBooks = filteredBooks.filter(book => book.author === filter.author);
    }

    if (filter.series) {
      filteredBooks = filteredBooks.filter(book => book.series === filter.series);
    }

    if (filter.theme) {
      filteredBooks = filteredBooks.filter(book => book.theme === filter.theme);
    }

    if (filter.isRead !== undefined) {
      filteredBooks = filteredBooks.filter(book => book.isRead === filter.isRead);
    }

    // Apply sorting
    if (sort) {
      filteredBooks.sort((a, b) => {
        const aValue = a[sort.field] || '';
        const bValue = b[sort.field] || '';
        
        if (sort.order === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    return filteredBooks;
  };

  return (
    <DatabaseContext.Provider value={{
      books,
      addBook,
      updateBook,
      deleteBook,
      getBook,
      searchBooks,
      isLoading,
      refreshBooks,
    }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}
