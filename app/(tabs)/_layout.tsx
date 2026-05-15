import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSettings } from '../../contexts/SettingsContext';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { colors, fs, altoContraste } = useSettings();

  // TabBar: tamanho do label limitado para não crescer demasiado com texto a 200%
  // (cumpre WCAG 1.4.4 sem ocupar metade do ecrã).
  // Não definimos `height` — deixamos o React Navigation calcular conforme o
  // conteúdo, evitando o espaço branco que surgia quando a altura era forçada
  // maior que o tamanho real dos itens.
  const labelFontSize = Math.min(fs(11), 13);
  const bottomInset = Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.subtext,
        tabBarLabelStyle: {
          fontSize: labelFontSize,
          fontWeight: '500',
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
        },
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopWidth: altoContraste ? 2 : 1,
          borderTopColor: colors.tabBarBorder,
          paddingTop: 6,
          paddingBottom: bottomInset,
          // sem `height` — RN calcula naturalmente a partir dos itens
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t.mapa,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'map' : 'map-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pesquisa"
        options={{
          title: t.pesquisa,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="horario"
        options={{
          title: t.horario,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'time' : 'time-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: t.favoritos,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: t.perfil,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
