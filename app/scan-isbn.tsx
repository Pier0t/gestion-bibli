import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useTheme } from '@/providers/ThemeProvider';
import { useDatabase } from '@/providers/DatabaseProvider';
import { GoogleBooksApi } from '@/services/googleBooksApi';
import { X, Slash as Flash, RotateCcw } from 'lucide-react-native';

export default function ScanISBNScreen() {
  const { colors } = useTheme();
  const { addBook } = useDatabase();
  const router = useRouter();
  
  const [facing, setFacing] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<'off' | 'on'>('off');
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
    },
    camera: {
      flex: 1,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 50,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    headerButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      color: 'white',
      fontSize: 18,
      fontWeight: '600',
    },
    scanArea: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    scanBox: {
      width: 280,
      height: 180,
      borderWidth: 2,
      borderColor: 'white',
      borderRadius: 16,
      position: 'relative',
    },
    scanCorner: {
      position: 'absolute',
      width: 20,
      height: 20,
      borderColor: colors.primary,
      borderWidth: 3,
    },
    scanCornerTopLeft: {
      top: -2,
      left: -2,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    scanCornerTopRight: {
      top: -2,
      right: -2,
      borderLeftWidth: 0,
      borderBottomWidth: 0,
    },
    scanCornerBottomLeft: {
      bottom: -2,
      left: -2,
      borderRightWidth: 0,
      borderTopWidth: 0,
    },
    scanCornerBottomRight: {
      bottom: -2,
      right: -2,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    instructions: {
      textAlign: 'center',
      color: 'white',
      fontSize: 16,
      marginTop: 24,
      paddingHorizontal: 20,
    },
    controls: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 50,
      gap: 40,
    },
    controlButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    permissionContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
      backgroundColor: colors.background,
    },
    permissionText: {
      fontSize: 18,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 24,
    },
    permissionButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    permissionButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  if (!permission) {
    return <View style={styles.permissionContainer} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Nous avons besoin d'accéder à votre caméra pour scanner les codes ISBN
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Autoriser l'accès</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (!isScanning) return;
    
    setIsScanning(false);
    
    try {
      const book = await GoogleBooksApi.searchByISBN(data);
      
      if (book) {
        await addBook(book);
        Alert.alert(
          'Livre ajouté !',
          `"${book.title}" a été ajouté à votre collection.`,
          [
            { text: 'OK', onPress: () => router.back() },
          ]
        );
      } else {
        Alert.alert(
          'Livre non trouvé',
          'Aucune information trouvée pour ce code ISBN. Voulez-vous l\'ajouter manuellement ?',
          [
            { text: 'Annuler', onPress: () => setIsScanning(true) },
            { 
              text: 'Ajouter manuellement', 
              onPress: () => router.replace('/add-manual') 
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la recherche. Veuillez réessayer.',
        [
          { text: 'OK', onPress: () => setIsScanning(true) },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
              <X size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Scanner ISBN</Text>
            <View style={styles.headerButton} />
          </View>

          <View style={styles.scanArea}>
            <View style={styles.scanBox}>
              <View style={[styles.scanCorner, styles.scanCornerTopLeft]} />
              <View style={[styles.scanCorner, styles.scanCornerTopRight]} />
              <View style={[styles.scanCorner, styles.scanCornerBottomLeft]} />
              <View style={[styles.scanCorner, styles.scanCornerBottomRight]} />
            </View>
            <Text style={styles.instructions}>
              Centrez le code-barres ISBN dans le cadre pour le scanner automatiquement
            </Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setFlashMode(flashMode === 'off' ? 'on' : 'off')}
            >
              <Flash size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
            >
              <RotateCcw size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}
