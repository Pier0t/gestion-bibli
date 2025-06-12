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
import { SlidersHorizontal, Grid2x2 as Grid, List } from 'lucide-react-native';

export default function CollectionScreen() {
  const { colors } = useTheme();
  const { books, searchBooks, isLoading } = useDatabase();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<BookFilter>({});
  const [sort, setSort] = useState<BookSort>({ field: 'dateAdded', order: 'desc' });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const filteredBooks = searchBooks({ ...filter, searchTerm }, sort);

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
    controls: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    statsText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    viewModeContainer: {
      flexDirection: 'row',
      gap: 8,
    },
    viewModeButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.surface,
    },
    viewModeButtonActive: {
      backgroundColor: colors.primary,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
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
      marginBottom: 16,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });

  const hasActiveFilters = Object.values(filter).some(value => value !== undefined);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ma Collection</Text>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <SearchBar
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Rechercher dans ma collection..."
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
      </View>

      <View style={styles.controls}>
        <Text style={styles.statsText}>
          {filteredBooks.length} livre{filteredBooks.length !== 1 ? 's' : ''}
        </Text>
        <View style={styles.viewModeContainer}>
          <TouchableOpacity
            style={[
              styles.viewModeButton,
              viewMode === 'list' && styles.viewModeButtonActive,
            ]}
            onPress={() => setViewMode('list')}
          >
            <List
              size={16}
              color={viewMode === 'list' ? 'white' : colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewModeButton,
              viewMode === 'grid' && styles.viewModeButtonActive,
            ]}
            onPress={() => setViewMode('grid')}
          >
            <Grid
              size={16}
              color={viewMode === 'grid' ? 'white' : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {filteredBooks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {books.length === 0
                ? 'Votre collection est vide'
                : 'Aucun livre trouvé'}
            </Text>
            <Text style={styles.emptySubtext}>
              {books.length === 0
                ? 'Commencez par ajouter votre premier livre !'
                : 'Essayez de modifier vos critères de recherche'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredBooks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BookCard
                book={item}
                onPress={() => router.push(`/book/${item.id}`)}
                compact={viewMode === 'grid'}
              />
            )}
            numColumns={viewMode === 'grid' ? 2 : 1}
            key={viewMode}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

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