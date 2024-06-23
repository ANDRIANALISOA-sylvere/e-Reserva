import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Material from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/FontAwesome";
import { createStackNavigator } from "@react-navigation/stack";
import {
  getFocusedRouteNameFromRoute,
  RouteProp,
} from "@react-navigation/native";
import { ViewStyle } from "react-native";

import Account from "../screens/AccountScreen";
import RoomListScreen from "../screens/RoomListScreen";
import RoomDetailsScreen from "../screens/RoomDetailScreen";
import FavorisScreen from "../screens/FavorisScreen";
import ReservationScreen from "../screens/ReservationScreen";
import NotificationScreen from "../screens/NotificationScreen";
import ReservationModalScreen from "../screens/ReservationModalScreen";
import { useTheme } from "@ui-kitten/components";

type RootStackParamList = {
  Room: undefined;
  RoomList: undefined;
  Salle: { roomId: string };
  Favoris: undefined;
  Reserver: undefined;
  Reservation: undefined;
  Notification: undefined;
  Account: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createStackNavigator<RootStackParamList>();
const RootStack = createStackNavigator();

const RoomStack = () => (
  <Stack.Navigator>
    <RootStack.Group>
      <Stack.Screen
        name="RoomList"
        component={RoomListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Salle"
        component={RoomDetailsScreen}
        options={{ headerShown: true }}
      />
    </RootStack.Group>
    <RootStack.Group screenOptions={{ presentation: "modal" }}>
      <RootStack.Screen name="Reservation" component={ReservationModalScreen} />
    </RootStack.Group>
  </Stack.Navigator>
);

export default function MainNavigator() {
  const theme = useTheme();
  const iconColor = theme["color-basic-600"];
  return (
    <Tab.Navigator
      initialRouteName="Room"
      screenOptions={{
        tabBarActiveTintColor: "#FF835C",
        tabBarInactiveTintColor: iconColor,
      }}
    >
      <Tab.Screen
        name="Room"
        component={RoomStack}
        options={({ route }) => ({
          tabBarLabel: "Explorer",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              color={color}
              size={size}
            />
          ),
          tabBarStyle: { paddingVertical: 5 },
        })}
      />
      <Tab.Screen
        name="Favoris"
        component={FavorisScreen}
        options={{
          tabBarLabel: "Favoris",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              color={color}
              size={size}
            />
          ),
          tabBarStyle: { paddingVertical: 5 },
        }}
      />
      <Tab.Screen
        name="Reserver"
        component={ReservationScreen}
        options={{
          tabBarLabel: "Reservation",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              color={color}
              size={size}
            />
          ),
          tabBarStyle: { paddingVertical: 5 },
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          tabBarLabel: "Notification",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Icon
              name={focused ? "bell" : "bell-o"}
              color={color}
              size={size}
            />
          ),
          tabBarBadge: 3,
          tabBarStyle: { paddingVertical: 5 },
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarLabel: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Material
              name={focused ? "account-circle" : "account-circle-outline"}
              color={color}
              size={size}
            />
          ),
          tabBarStyle: { paddingVertical: 5 },
        }}
      />
    </Tab.Navigator>
  );
}
