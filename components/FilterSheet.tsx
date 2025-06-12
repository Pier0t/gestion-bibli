import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { useDatabase } from '@/providers/DatabaseProvider';
import { BookFilter, BookSort } from '@/types/Book';
import { X, Check } from 'lucide-react-native';

interface FilterSheetProps {
  isVisible: boolean;
  onClose: () => void;
  filter: BookFilter;
  sort: BookSort;
  onFilterChange: (filter: BookFilter) => void;
  onSortChange: (sort: BookSort) => void;
}

export function FilterSheet({ 
  isVisible, 
  onClose, 
  filter, 
  sort, 
  onFilterChange, 
  onSortChange 
}: FilterSheetProps) {
  const { colors } = useTheme();
  const { books } = useDatabase();

  const genres = [...new Set(books.map(book => book.genre).filter(Boolean))];
  const authors = [...new Set(books.map(book => book.author).filter(Boolean))];
  const series = [...new Set(books.map(book => book.series).filter(Boolean))];
  const themes = [...new Set(books.map(book => book.theme).filter(Boolean))];

  const sortOptions = [
    { field: 'title' as const, label: 'Titre' },
    { field: 'author' as const, label: 'Auteur' },
    { field: 'dateAdded' as const, label: 'Date d\'ajout' },
    { field: 'publicationYear' as const, label: 'Année de publication' },
    { field: 'series' as const, label: 'Série' },
    { field: 'genre' as const, label: 'Genre' },
  ];

  const styles = StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '80%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    content: {
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    option: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.surface,
      borderRadius: 8,
      marginBottom: 8,
    },
    optionSelected: {
      backgroundColor: colors.primary + '20',
    },
    optionText: {
      fontSize: 14,
      color: colors.text,
    },
    optionTextSelected: {
      color: colors.primary,
      fontWeight: '500',
    },
    sortOrder: {
      flexDirection: 'row',
      gap: 8,
    },
    sortOrderButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: colors.surface,
      borderRadius: 8,
      alignItems: 'center',
    },
    sortOrderButtonSelected: {
      backgroundColor: colors.primary,
    },
    sortOrderText: {
      fontSize: 14,
      color: colors.text,
    },
    sortOrderTextSelected: {
      color: 'white',
      fontWeight: '500',
    },
    clearButton: {
      marginTop: 16,
      padding: 12,
      backgroundColor: colors.accent,
      borderRadius: 8,
      alignItems: 'center',
    },
    clearButtonText: {
      color: 'white',
      fontWeight: '500',
    },
  });

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Filtres et tri</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content}>
          {/* Sort Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trier par</Text>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.field}
                style={[
                  styles.option,
                  sort.field === option.field && styles.optionSelected,
                ]}
                onPress={() => onSortChange({ ...sort, field: option.field })}
              >
                <Text
                  style={[
                    styles.optionText,
                    sort.field === option.field && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {sort.field === option.field && (
                  <Check size={16} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
            
            <View style={styles.sortOrder}>
              <TouchableOpacity
                style={[
                  styles.sortOrderButton,
                  sort.order === 'asc' && styles.sortOrderButtonSelected,
                ]}
                onPress={() => onSortChange({ ...sort, order: 'asc' })}
              >
                <Text
                  style={[
                    styles.sortOrderText,
                    sort.order === 'asc' && styles.sortOrderTextSelected,
                  ]}
                >
                  Croissant
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sortOrderButton,
                  sort.order === 'desc' && styles.sortOrderButtonSelected,
                ]}
                onPress={() => onSortChange({ ...sort, order: 'desc' })}
              >
                <Text
                  style={[
                    styles.sortOrderText,
                    sort.order === 'desc' && styles.sortOrderTextSelected,
                  ]}
                >
                  Décroissant
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Genre Filter */}
          {genres.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Genre</Text>
              {genres.map((genre) => (
                <TouchableOpacity
                  key={genre}
                  style={[
                    styles.option,
                    filter.genre === genre && styles.optionSelected,
                  ]}
                  onPress={() =>
                    onFilterChange({
                      ...filter,
                      genre: filter.genre === genre ? undefined : genre,
                    })
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      filter.genre === genre && styles.optionTextSelected,
                    ]}
                  >
                    {genre}
                  </Text>
                  {filter.genre === genre && (
                    <Check size={16} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Author Filter */}
          {authors.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Auteur</Text>
              {authors.slice(0, 10).map((author) => (
                <TouchableOpacity
                  key={author}
                  style={[
                    styles.option,
                    filter.author === author && styles.optionSelected,
                  ]}
                  onPress={() =>
                    onFilterChange({
                      ...filter,
                      author: filter.author === author ? undefined : author,
                    })
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      filter.author === author && styles.optionTextSelected,
                    ]}
                  >
                    {author}
                  </Text>
                  {filter.author === author && (
                    <Check size={16} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Clear Filters */}
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              onFilterChange({});
              onSortChange({ field: 'dateAdded', order: 'desc' });
            }}
          >
            <Text style={styles.clearButtonText}>Effacer tous les filtres</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}