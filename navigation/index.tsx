/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import DineInScreen from '../screens/DineIn';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import TakeAwayScreen from '../screens/TakeAway';
import DeliveryScreen from '../screens/Delivery';
import PickupScreen from '../screens/Pickup';
import OrderDetailsScreen from '../screens/OrderDetails';
import Cart from '../screens/Cart';
import SettingScreen from '../screens/Settings';
import Login from '../screens/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/Api'
import { io } from 'socket.io-client';
import { useSocketUrl, useSocket } from '../contexts/context';
import Camera from '../screens/Camera';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName={"Login"}>
      <Stack.Screen name="Camera" component={Camera} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false, contentStyle: { backgroundColor: 'white' } }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
        <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
        <Stack.Screen name="Cart" component={Cart} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="DineIn"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        tabBarStyle: { backgroundColor: '#ABD2F0', bottom: 10, marginHorizontal: 20, height: 100, borderRadius: 20 },
        tabBarItemStyle: { paddingVertical: 30 }
      }}>
      {/* <BottomTab.Screen
        name="TabOne"
        component={TabOneScreen}
        options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />*/}
      <BottomTab.Screen
        name="DineIn"
        component={DineInScreen}
        options={{
          title: 'Dine In',
          tabBarIcon: ({ color }) => <TabBarIcon name="ramen-dining" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="TakeAway"
        component={TakeAwayScreen}
        options={{
          title: 'Take Away',
          tabBarIcon: ({ color }) => <TabBarIcon name="takeout-dining" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Pickup"
        component={PickupScreen}
        options={{
          title: 'Pickup',
          tabBarIcon: ({ color }) => <TabBarIcon name="fastfood" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Delivery"
        component={DeliveryScreen}
        options={{
          title: 'Delivery',
          tabBarIcon: ({ color }) => <TabBarIcon name="delivery-dining" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          headerLeft: () => <AntDesign name="setting" size={30} color="black" />,
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="more-horiz" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}) {
  return <MaterialIcons size={30} style={{ marginBottom: -3 }} {...props} />;
}
