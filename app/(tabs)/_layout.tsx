import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSettings } from '../../contexts/SettingsContext';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { colors, fs, altoContraste } = useSettings();

  // Altura da TabBar: cresce com o tamanho do texto mas com saturação
  // para evitar que o tab bar fique gigantesco com texto a 200%.
  //   - Texto pequeno (0.85x) → 75px (mínimo)
  //   - Texto normal (1.0x)   → 75px
  //   - Texto grande (1.25x)  → ~80px
  //   - Texto extra (1.6x)    → ~92px
  //   - Texto máximo (2.0x)   → ~110px
  const tabBarBaseHeight = Math.max(75, fs(48) + 28);
  const bottomInset = Math.max(insets.bottom, 12);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.subtext,
        tabBarLabelStyle: {
          fontSize: fs(11),
          fontWeight: '500',
        },
        tabBarItemStyle: {
          // Distribui icon + label uniformemente — evita "espaço em branco"
          // quando a TabBar cresce com o tamanho do texto.
          justifyContent: 'center',
          paddingVertical: 6,
        },
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopWidth: altoContraste ? 2 : 1,
          borderTopColor: colors.tabBarBorder,
          height: tabBarBaseHeight + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 4,
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
