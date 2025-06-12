import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { Book } from '@/types/Book';
import { Star, BookOpen } from 'lucide-react-native';

interface BookCardProps {
  book: Book;
  onPress: () => void;
  compact?: boolean;
}

export function BookCard({ book, onPress, compact = false }: BookCardProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: compact ? 12 : 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    content: {
      flexDirection: 'row',
    },
    coverContainer: {
      marginRight: 12,
    },
    cover: {
      width: compact ? 60 : 80,
      height: compact ? 90 : 120,
      borderRadius: 8,
      backgroundColor: colors.border,
    },
    coverPlaceholder: {
      width: compact ? 60 : 80,
      height: compact ? 90 : 120,
      borderRadius: 8,
      backgroundColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    info: {
      flex: 1,
      justifyContent: 'space-between',
    },
    title: {
      fontSize: compact ? 16 : 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    author: {
      fontSize: compact ? 14 : 16,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    metadata: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 8,
    },
    tag: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    tagText: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '500',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    rating: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 4,
    },
    readStatus: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    readText: {
      fontSize: 12,
      color: colors.success,
      marginLeft: 4,
      fontWeight: '500',
    },
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.coverContainer}>
          {book.coverImage ? (
            <Image source={{ uri: book.coverImage }} style={styles.cover} />
          ) : (
            <View style={styles.coverPlaceholder}>
              <BookOpen size={24} color={colors.textSecondary} />
            </View>
          )}
        </View>
        
        <View style={styles.info}>
          <View>
            <Text style={styles.title} numberOfLines={2}>
              {book.title}
            </Text>
            <Text style={styles.author} numberOfLines={1}>
              {book.author}
            </Text>
            
            {!compact && (
              <View style={styles.metadata}>
                {book.genre && (
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{book.genre}</Text>
                  </View>
                )}
                {book.series && (
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{book.series}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
          
          <View style={styles.footer}>
            {book.personalRating && (
              <View style={styles.rating}>
                <Star size={16} color={colors.accent} fill={colors.accent} />
                <Text style={styles.ratingText}>{book.personalRating}/5</Text>
              </View>
            )}
            
            {book.isRead && (
              <View style={styles.readStatus}>
                <BookOpen size={16} color={colors.success} />
                <Text style={styles.readText}>Lu</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}