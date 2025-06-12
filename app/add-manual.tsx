import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/providers/ThemeProvider';
import { useDatabase } from '@/providers/DatabaseProvider';
import { Book } from '@/types/Book';
import { X, Save, Star } from 'lucide-react-native';

export default function AddManualScreen() {
  const { colors } = useTheme();
  const { addBook } = useDatabase();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    publisher: '',
    series: '',
    seriesNumber: '',
    theme: '',
    pages: '',
    publicationYear: '',
    language: 'Français',
    description: '',
    personalNotes: '',
    personalRating: 0,
    isRead: false,
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerButton: {
      padding: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
    },
    content: {
      flex: 1,
    },
    form: {
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
    field: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 8,
    },
    required: {
      color: colors.error,
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    row: {
      flexDirection: 'row',
      gap: 12,
    },
    flex: {
      flex: 1,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    ratingButton: {
      padding: 4,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    checkboxText: {
      fontSize: 16,
      color: colors.text,
    },
    saveButton: {
      backgroundColor: colors.primary,
      margin: 20,
      padding: 16,
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },
    saveButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const updateField = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.author.trim()) {
      Alert.alert('Erreur', 'Le titre et l\'auteur sont obligatoires.');
      return;
    }

    try {
      const bookData: Omit<Book, 'id' | 'dateAdded' | 'dateModified'> = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        isbn: formData.isbn.trim() || undefined,
        genre: formData.genre.trim() || undefined,
        publisher: formData.publisher.trim() || undefined,
        series: formData.series.trim() || undefined,
        seriesNumber: formData.seriesNumber ? parseInt(formData.seriesNumber) : undefined,
        theme: formData.theme.trim() || undefined,
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        publicationYear: formData.publicationYear ? parseInt(formData.publicationYear) : undefined,
        language: formData.language.trim() || undefined,
        description: formData.description.trim() || undefined,
        personalNotes: formData.personalNotes.trim() || undefined,
        personalRating: formData.personalRating || undefined,
        isRead: formData.isRead,
      };

      await addBook(bookData);
      
      Alert.alert(
        'Livre ajouté !',
        `"${bookData.title}" a été ajouté à votre collection.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout du livre.');
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <TouchableOpacity
        key={index}
        style={styles.ratingButton}
        onPress={() => updateField('personalRating', index + 1)}
      >
        <Star
          size={24}
          color={index < formData.personalRating ? colors.accent : colors.border}
          fill={index < formData.personalRating ? colors.accent : 'transparent'}
        />
      </TouchableOpacity>
    ));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Ajouter un livre</Text>
          <View style={styles.headerButton} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informations principales</Text>
              
              <View style={styles.field}>
                <Text style={styles.label}>
                  Titre <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.title}
                  onChangeText={(text) => updateField('title', text)}
                  placeholder="Entrez le titre du livre"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>
                  Auteur <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.author}
                  onChangeText={(text) => updateField('author', text)}
                  placeholder="Entrez le nom de l'auteur"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>ISBN</Text>
                <TextInput
                  style={styles.input}
                  value={formData.isbn}
                  onChangeText={(text) => updateField('isbn', text)}
                  placeholder="Code ISBN (optionnel)"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Détails</Text>
              
              <View style={styles.row}>
                <View style={[styles.field, styles.flex]}>
                  <Text style={styles.label}>Genre</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.genre}
                    onChangeText={(text) => updateField('genre', text)}
                    placeholder="Roman, BD, etc."
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>

                <View style={[styles.field, styles.flex]}>
                  <Text style={styles.label}>Éditeur</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.publisher}
                    onChangeText={(text) => updateField('publisher', text)}
                    placeholder="Nom de l'éditeur"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.field, styles.flex]}>
                  <Text style={styles.label}>Série</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.series}
                    onChangeText={(text) => updateField('series', text)}
                    placeholder="Nom de la série"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Tome</Text>
                  <TextInput
                    style={[styles.input, { width: 80 }]}
                    value={formData.seriesNumber}
                    onChangeText={(text) => updateField('seriesNumber', text)}
                    placeholder="N°"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Thème</Text>
                <TextInput
                  style={styles.input}
                  value={formData.theme}
                  onChangeText={(text) => updateField('theme', text)}
                  placeholder="Science-fiction, Histoire, etc."
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.field, styles.flex]}>
                  <Text style={styles.label}>Pages</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.pages}
                    onChangeText={(text) => updateField('pages', text)}
                    placeholder="Nombre"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.field, styles.flex]}>
                  <Text style={styles.label}>Année</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.publicationYear}
                    onChangeText={(text) => updateField('publicationYear', text)}
                    placeholder="2024"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.field, styles.flex]}>
                  <Text style={styles.label}>Langue</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.language}
                    onChangeText={(text) => updateField('language', text)}
                    placeholder="Français"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text) => updateField('description', text)}
                  placeholder="Résumé du livre..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Évaluation personnelle</Text>
              
              <View style={styles.field}>
                <Text style={styles.label}>Note</Text>
                <View style={styles.ratingContainer}>
                  {renderStars()}
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Notes personnelles</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.personalNotes}
                  onChangeText={(text) => updateField('personalNotes', text)}
                  placeholder="Vos impressions, commentaires..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                />
              </View>

              <View style={styles.field}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => updateField('isRead', !formData.isRead)}
                >
                  <View style={[styles.checkbox, formData.isRead && styles.checkboxChecked]}>
                    {formData.isRead && <Text style={{ color: 'white', fontSize: 12 }}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxText}>J'ai lu ce livre</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save size={20} color="white" />
          <Text style={styles.saveButtonText}>Ajouter le livre</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}