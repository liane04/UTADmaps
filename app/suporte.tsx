import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSettings } from '../contexts/SettingsContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function SuporteScreen() {
  const router = useRouter();
  const { colors, fs, altoContraste } = useSettings();
  const { t, tr } = useLanguage();

  const handleEmail = () => {
    Linking.openURL('mailto:UTADmaps@utad.pt?subject=Suporte UTAD Maps');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
          <Text style={[styles.backText, { color: colors.text, fontSize: fs(16) }]}>{t.voltar}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fs(16) }]}>{tr('Suporte e Ajuda', 'Support & Help')}</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="help-buoy-outline" size={64} color={colors.subtext} />
        </View>

        <Text style={[styles.title, { color: colors.text, fontSize: fs(24) }]}>
          {tr('Precisas de ajuda?', 'Need help?')}
        </Text>
        
        <Text style={[styles.description, { color: colors.text, fontSize: fs(16) }]}>
          {tr('Este é um protótipo do UTAD Maps. Se encontrares algum problema ou tiveres sugestões de melhoria, não hesites em contactar a nossa equipa de desenvolvimento.', 'This is a prototype of UTAD Maps. If you find any issues or have suggestions for improvement, do not hesitate to contact our development team.')}
        </Text>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary, borderWidth: altoContraste ? 2 : 0, borderColor: colors.border }]} 
          onPress={handleEmail}
        >
          <Ionicons name="mail" size={20} color={colors.bg} />
          <Text style={[styles.buttonText, { color: colors.bg, fontSize: fs(16) }]}>
            {tr('Enviar E-mail', 'Send Email')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F2F2F7' 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 12 
  },
  backButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    width: 80 
  },
  backText: { 
    fontSize: 16, 
    color: '#000000' 
  },
  headerTitle: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  content: { 
    padding: 24, 
    alignItems: 'center', 
    paddingTop: 60 
  },
  iconContainer: { 
    marginBottom: 24 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 16, 
    textAlign: 'center' 
  },
  description: { 
    fontSize: 16, 
    textAlign: 'center', 
    marginBottom: 40, 
    lineHeight: 24 
  },
  button: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#2C2C2E', 
    paddingVertical: 16, 
    paddingHorizontal: 32, 
    borderRadius: 12, 
    gap: 12, 
    width: '100%' 
  },
  buttonText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#FFFFFF' 
  }
});
