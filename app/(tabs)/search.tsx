import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/providers/ThemeProvider';
import { useDatabase } from '@/providers/DatabaseProvider';
import { BookCard } from '@/components/BookCard';
import { SearchBar } from '@/components/SearchBar';
import { FilterSheet } from '@/components/FilterSheet';
import { BookFilter, BookSort } from '@/types/Book';
import { SlidersHorizontal, TrendingUp, Clock, Star } from 'lucide-react-native';

export default function SearchScreen() {
  const { colors } = useTheme();
  const { books, searchBooks } = useDatabase();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<BookFilter>({});
  const [sort, setSort] = useState<BookSort>({ field: 'dateAdded', order: 'desc' });
  const [showFilters, setShowFilters] = useState(false);

  const filteredBooks = searchBooks({ ...filter, searchTerm }, sort);
  const recentBooks = books.slice(0, 5);
  const topRatedBooks = books
    .filter(book => book.personalRating && book.personalRating >= 4)
    .sort((a, b) => (b.personalRating || 0) - (a.personalRating || 0))
    .slice(0, 5);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      paddingBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    searchContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    searchBar: {
      flex: 1,
    },
    filterButton: {
      padding: 12,
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    filterButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    content: {
      flex: 1,
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginLeft: 8,
    },
    quickFilters: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      gap: 12,
      marginBottom: 16,
    },
    quickFilterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: colors.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickFilterButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    quickFilterText: {
      fontSize: 14,
      color: colors.text,
    },
    quickFilterTextActive: {
      color: 'white',
      fontWeight: '500',
    },
    resultsContainer: {
      paddingHorizontal: 20,
    },
    resultsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    resultsCount: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyText: {
      fontSize: 18,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });

  const hasActiveFilters = Object.values(filter).some(value => value !== undefined);
  const hasSearch = searchTerm.length > 0 || hasActiveFilters;

  const quickFilters = [
    { key: 'unread', label: 'Non lus', filter: { isRead: false } },
    { key: 'read', label: 'Lus', filter: { isRead: true } },
    { key: 'rated', label: 'Notés', filter: {} },
  ];

  const handleQuickFilter = (filterKey: string, filterValue: BookFilter) => {
    if (filter.isRead === filterValue.isRead) {
      setFilter({ ...filter, isRead: undefined });
    } else {
      setFilter({ ...filter, ...filterValue });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recherche</Text>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <SearchBar
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Rechercher titre, auteur, série..."
              onClear={() => setSearchTerm('')}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.filterButton,
              hasActiveFilters && styles.filterButtonActive,
            ]}
            onPress={() => setShowFilters(true)}
          >
            <SlidersHorizontal
              size={20}
              color={hasActiveFilters ? 'white' : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.quickFilters}>
          {quickFilters.map((quickFilter) => (
            <TouchableOpacity
              key={quickFilter.key}
              style={[
                styles.quickFilterButton,
                filter.isRead === quickFilter.filter.isRead && styles.quickFilterButtonActive,
              ]}
              onPress={() => handleQuickFilter(quickFilter.key, quickFilter.filter)}
            >
              <Text
                style={[
                  styles.quickFilterText,
                  filter.isRead === quickFilter.filter.isRead && styles.quickFilterTextActive,
                ]}
              >
                {quickFilter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        style={styles.content}
        data={hasSearch ? filteredBooks : []}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          hasSearch ? (
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                {filteredBooks.length} résultat{filteredBooks.length !== 1 ? 's' : ''}
              </Text>
            </View>
          ) : (
            <View>
              {recentBooks.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Clock size={20} color={colors.primary} />
                    <Text style={styles.sectionTitle}>Récemment ajoutés</Text>
                  </View>
                  {recentBooks.map((book) => (
                    <View key={book.id} style={styles.resultsContainer}>
                      <BookCard
                        book={book}
                        onPress={() => router.push(`/book/${book.id}`)}
                        compact
                      />
                    </View>
                  ))}
                </View>
              )}

              {topRatedBooks.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Star size={20} color={colors.accent} />
                    <Text style={styles.sectionTitle}>Mieux notés</Text>
                  </View>
                  {topRatedBooks.map((book) => (
                    <View key={book.id} style={styles.resultsContainer}>
                      <BookCard
                        book={book}
                        onPress={() => router.push(`/book/${book.id}`)}
                        compact
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.resultsContainer}>
            <BookCard
              book={item}
              onPress={() => router.push(`/book/${item.id}`)}
            />
          </View>
        )}
        ListEmptyComponent={
          hasSearch ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun résultat trouvé</Text>
              <Text style={styles.emptySubtext}>
                Essayez de modifier vos critères de recherche
              </Text>
            </View>
          ) : books.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Votre collection est vide</Text>
              <Text style={styles.emptySubtext}>
                Commencez par ajouter quelques livres !
              </Text>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />

      <FilterSheet
        isVisible={showFilters}
        onClose={() => setShowFilters(false)}
        filter={filter}
        sort={sort}
        onFilterChange={setFilter}
        onSortChange={setSort}
      />
    </SafeAreaView>
  );
}
