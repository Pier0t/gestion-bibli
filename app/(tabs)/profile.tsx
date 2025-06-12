import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/providers/ThemeProvider';
import { useDatabase } from '@/providers/DatabaseProvider';
import { Moon, Sun, BookOpen, TrendingUp, Calendar, Star, ChartPie as PieChart, Settings, Info } from 'lucide-react-native';

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { books } = useDatabase();

  const totalBooks = books.length;
  const readBooks = books.filter(book => book.isRead).length;
  const unreadBooks = totalBooks - readBooks;
  const averageRating = books
    .filter(book => book.personalRating)
    .reduce((sum, book) => sum + (book.personalRating || 0), 0) / 
    books.filter(book => book.personalRating).length || 0;

  const genres = books.reduce((acc, book) => {
    if (book.genre) {
      acc[book.genre] = (acc[book.genre] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topGenre = Object.entries(genres)
    .sort(([,a], [,b]) => b - a)[0]?.[0];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      paddingBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    content: {
      flex: 1,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
      paddingHorizontal: 20,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 20,
      gap: 12,
    },
    statCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      flex: 1,
      minWidth: '45%',
      borderWidth: 1,
      borderColor: colors.border,
    },
    statIcon: {
      marginBottom: 8,
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    settingsList: {
      paddingHorizontal: 20,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    settingInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 12,
    },
    themeButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.primary + '20',
    },
    aboutCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      marginHorizontal: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    aboutTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    aboutText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    version: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 8,
      fontStyle: 'italic',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
        <Text style={styles.subtitle}>
          Vos statistiques et paramètres
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistiques</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <BookOpen size={24} color={colors.primary} />
              </View>
              <Text style={styles.statValue}>{totalBooks}</Text>
              <Text style={styles.statLabel}>Total Livres</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <TrendingUp size={24} color={colors.success} />
              </View>
              <Text style={styles.statValue}>{readBooks}</Text>
              <Text style={styles.statLabel}>Livres Lus</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Calendar size={24} color={colors.accent} />
              </View>
              <Text style={styles.statValue}>{unreadBooks}</Text>
              <Text style={styles.statLabel}>À Lire</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Star size={24} color={colors.warning} />
              </View>
              <Text style={styles.statValue}>
                {averageRating ? averageRating.toFixed(1) : '—'}
              </Text>
              <Text style={styles.statLabel}>Note Moyenne</Text>
            </View>

            {topGenre && (
              <View style={[styles.statCard, { minWidth: '100%' }]}>
                <View style={styles.statIcon}>
                  <PieChart size={24} color={colors.secondary} />
                </View>
                <Text style={styles.statValue}>{topGenre}</Text>
                <Text style={styles.statLabel}>Genre Préféré</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paramètres</Text>
          <View style={styles.settingsList}>
            <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
              <View style={styles.settingInfo}>
                {isDark ? (
                  <Sun size={20} color={colors.text} />
                ) : (
                  <Moon size={20} color={colors.text} />
                )}
                <Text style={styles.settingText}>
                  Mode {isDark ? 'Clair' : 'Sombre'}
                </Text>
              </View>
              <View style={styles.themeButton}>
                {isDark ? (
                  <Sun size={16} color={colors.primary} />
                ) : (
                  <Moon size={16} color={colors.primary} />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Settings size={20} color={colors.text} />
                <Text style={styles.settingText}>Préférences</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <View style={styles.aboutCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Info size={20} color={colors.primary} />
              <Text style={styles.aboutTitle}>Bookscope</Text>
            </View>
            <Text style={styles.aboutText}>
              Bookscope est votre compagnon idéal pour gérer votre bibliothèque personnelle. 
              Organisez, recherchez et découvrez vos livres avec une interface moderne et intuitive.
            </Text>
            <Text style={styles.version}>Version 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}