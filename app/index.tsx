import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Ü</Text>
        <Ionicons name="compass-outline" size={24} color="#8E8E93" style={styles.logoIcon} />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Bem-vindo ao{'\n'}UTAD Maps</Text>
        <Text style={styles.subtitle}>Navegue pelo campus com facilidade</Text>

        <Text style={styles.label}>Language</Text>
        <View style={styles.languageToggle}>
          <View style={[styles.languagePill, styles.languagePillSelected]}>
            <Ionicons name="radio-button-on" size={20} color="#000000" />
            <Text style={[styles.languageText, styles.languageTextSelected]}>Português</Text>
          </View>
          <View style={[styles.languagePill, styles.languagePillUnselected]}>
            <Ionicons name="radio-button-off" size={20} color="#8E8E93" />
            <Text style={styles.languageText}>English</Text>
          </View>
        </View>

        <Text style={styles.label}>
          Email Institucional Login <Text style={styles.optionalText}>(optional)</Text>
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email @utad.eu"
            placeholderTextColor="#8E8E93"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleContinue} style={styles.skipButton}>
        <Text style={styles.skipText}>Saltar e explorar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8E8E93',
  },
  logoIcon: {
    position: 'absolute',
    bottom: 5,
    right: -15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 8,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  languageToggle: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  languagePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  languagePillSelected: {
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
  },
  languagePillUnselected: {
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  languageText: {
    fontSize: 16,
    color: '#000000',
  },
  languageTextSelected: {
    fontWeight: '500',
  },
  optionalText: {
    color: '#8E8E93',
    fontWeight: '400',
  },
  inputContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000000',
  },
  button: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: 32,
  },
  skipText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
});
