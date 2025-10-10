import { Tabs } from 'expo-router';

import Colors from '@/constants/colors';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { FontIcon } from '@/shared/ui/icon-wrapper/FontIcon';



export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarStyle: { 
          backgroundColor: Colors.bgWrapper,
          borderTopWidth: 0,
        },
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: () => <FontIcon iconFamily='Foundation' iconName='bitcoin-circle' size={24} color={Colors.primary} />,
          tabBarLabel: '',
          tabBarLabelStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="withdraw"
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: () => <FontIcon iconFamily='Entypo' iconName='wallet' size={24} color={Colors.primary} />,
          tabBarLabel: '',
          tabBarLabelStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}
