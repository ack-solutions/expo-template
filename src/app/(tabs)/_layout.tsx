import { Typography } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Base height for icons + label row (before system nav / home indicator inset). */
const TAB_BAR_CONTENT_HEIGHT = Platform.select({
  ios: 49,
  android: 52,
  default: 52
});

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const colors = useAppColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        sceneStyle: {
          backgroundColor: colors.background,
        },
        tabBarStyle: [
          styles.tabBar(colors),
          {
            paddingBottom: insets.bottom,
            height: TAB_BAR_CONTENT_HEIGHT + insets.bottom,
          },
        ],
        tabBarLabelStyle: styles.tabLabel,
        tabBarIconStyle: styles.tabIcon,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={20}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="workspace"
        options={{
          title: 'Workspace',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={20}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Data',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'folder' : 'folder-outline'}
              size={20}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={20}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="components"
        options={{
          title: 'UI Kit',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'color-palette' : 'color-palette-outline'}
              size={20}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = {
  tabBar: (colors: ReturnType<typeof useAppColors>) => ({
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: 4,
    elevation: 8,
    shadowColor: colors.shadowDark,
    shadowOpacity: 0.2,
    shadowOffset: {
 width: 0,
height: -2 
},
    shadowRadius: 8,
  }),
  tabLabel: {
    ...Typography.smallMedium,
    marginTop: 1,
    marginBottom: 2,
  },
  tabIcon: {
    marginBottom: -2,
  },
};
