import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Material from "react-native-vector-icons/MaterialCommunityIcons";

import Account from "../screens/AccountScreen";
import Room from "../screens/RoomListScreen";
import FavorisScreen from "../screens/FavorisScreen";
import ReservationScreen from "../screens/ReservationScreen";
import ChatScreen from "../screens/ChatScreen";
import { useTheme } from "@ui-kitten/components";

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  const theme = useTheme();
  const iconColor = theme["color-basic-600"];
  return (
    <Tab.Navigator
      initialRouteName="Room"
      screenOptions={{
        tabBarActiveTintColor: "#FF835C",
        tabBarInactiveTintColor: iconColor,
        tabBarStyle: { paddingVertical: 5 },
      }}
    >
      <Tab.Screen
        name="Room"
        component={Room}
        options={{
          tabBarLabel: "Explorer",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              color={color}
              size={size}
            />
          ),
        }}
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
        }}
      />
      <Tab.Screen
        name="Reservation"
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
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: "Message",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Material
              name={focused ? "chat" : "chat-outline"}
              color={color}
              size={size}
            />
          ),
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
        }}
      />
    </Tab.Navigator>
  );
}
