import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, Platform } from 'react-native';
import { Users, UserCheck, Plus, Bike, Calendar, LayoutGrid, ShieldCheck } from 'lucide-react-native';
import { Colors } from '../../theme/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          elevation: 8,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ledger',
          tabBarIcon: ({ color }) => <Users color={color} size={19} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Balances',
          tabBarIcon: ({ color }) => <UserCheck color={color} size={19} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Split',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: focused ? Colors.primaryDark : Colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 4,
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 4,
              }}
            >
              <Plus color="#FFFFFF" size={20} strokeWidth={2.5} />
            </View>
          ),
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            marginTop: 0,
          },
        }}
      />
      <Tabs.Screen
        name="bike"
        options={{
          title: 'Bike',
          tabBarIcon: ({ color }) => <Bike color={color} size={19} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Horizon',
          tabBarIcon: ({ color }) => <Calendar color={color} size={19} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="widgets"
        options={{
          title: 'Widgets',
          tabBarIcon: ({ color }) => <LayoutGrid color={color} size={19} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Security',
          tabBarIcon: ({ color }) => <ShieldCheck color={color} size={19} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}
