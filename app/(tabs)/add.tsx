import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/providers/ThemeProvider';
import { Camera, BookOpen, Plus } from 'lucide-react-native';

export default function AddScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      paddingBottom: 32,
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
      paddingHorizontal: 20,
    },
    optionCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    optionIcon: {
      marginBottom: 16,
    },
    optionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    optionDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    quickAddSection: {
      marginTop: 32,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
    },
    quickAddButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 12,
      justifyContent: 'center',
    },
    quickAddText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
  });

  const handleScanISBN = () => {
    router.push('/scan-isbn');
  };

  const handleManualAdd = () => {
    router.push('/add-manual');
  };

  const handleQuickAdd = () => {
    Alert.alert(
      'Ajout rapide',
      'Entrez simplement le titre et l\'auteur pour un ajout rapide',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Continuer', onPress: () => router.push('/add-quick') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ajouter un livre</Text>
        <Text style={styles.subtitle}>
          Choisissez votre méthode d'ajout préférée
        </Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.optionCard} onPress={handleScanISBN}>
          <View style={styles.optionIcon}>
            <Camera size={48} color={colors.primary} />
          </View>
          <Text style={styles.optionTitle}>Scanner un code ISBN</Text>
          <Text style={styles.optionDescription}>
            Utilisez l'appareil photo pour scanner le code-barres du livre et récupérer automatiquement toutes les informations
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={handleManualAdd}>
          <View style={styles.optionIcon}>
            <BookOpen size={48} color={colors.secondary} />
          </View>
          <Text style={styles.optionTitle}>Ajout manuel complet</Text>
          <Text style={styles.optionDescription}>
            Remplissez un formulaire détaillé avec toutes les informations du livre : titre, auteur, genre, série, etc.
          </Text>
        </TouchableOpacity>

        <View style={styles.quickAddSection}>
          <Text style={styles.sectionTitle}>Ajout rapide</Text>
          <TouchableOpacity style={styles.quickAddButton} onPress={handleQuickAdd}>
            <Plus size={20} color="white" />
            <Text style={styles.quickAddText}>Ajout express</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
