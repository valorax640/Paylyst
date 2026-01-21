import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/HomeScreen';
import PeopleScreen from '../screens/PeopleScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import ExpenseDetailsScreen from '../screens/ExpenseDetailsScreen';
import SettlementScreen from '../screens/SettlementScreen';
import { COLORS } from '../constants/colors';
import { useApp } from '../context/AppContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const getTabBarIcon = (route, focused, color, size) => {
  let iconName;

  if (route.name === 'HomeTab') {
    iconName = focused ? 'home' : 'home-outline';
  } else if (route.name === 'People') {
    iconName = focused ? 'account-group' : 'account-group-outline';
  } else if (route.name === 'AddExpense') {
    iconName = focused ? 'plus-circle' : 'plus-circle-outline';
  } else if (route.name === 'Settlement') {
    iconName = focused ? 'cash-multiple' : 'cash-multiple';
  }

  return <Icon name={iconName} size={size} color={color} />;
};

const TabNavigator = () => {
  const { people } = useApp();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => getTabBarIcon(route, focused, color, size),
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: 18,
          paddingTop: 8,
          height: 80,
          elevation: 8,
          shadowColor: COLORS.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="People" 
        component={PeopleScreen}
        options={{
          tabBarLabel: 'People',
          tabBarBadge: people.length > 0 ? people.length : null,
        }}
      />
      <Tab.Screen 
        name="AddExpense" 
        component={AddExpenseScreen}
        options={{
          tabBarLabel: 'Add Bill',
        }}
      />
      <Tab.Screen 
        name="Settlement" 
        component={SettlementScreen}
        options={{
          tabBarLabel: 'Settle',
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerShadowVisible: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="MainTabs" 
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="ExpenseDetails" 
          component={ExpenseDetailsScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;