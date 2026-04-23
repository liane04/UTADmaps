import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../../contexts/SettingsContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function FavoritosScreen() {
  const { colors, fs } = useSettings();
  const { tr } = useLanguage();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.content}>
        <Ionicons name="heart-outline" size={64} color="#D1D1D6" style={styles.icon} />
        <Text style={[styles.text, { color: colors.subtext, fontSize: fs(18) }]}>{tr('Sem favoritos ainda', 'No favourites yet')}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    color: '#8E8E93',
  },
});
