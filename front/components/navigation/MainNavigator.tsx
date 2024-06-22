import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Material from "react-native-vector-icons/MaterialCommunityIcons";

import HomeScreen from "../screens/HomeScreen";
import Room from "../screens/RoomListScreen";
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
              name={focused ? "home" : "home-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Acceuil"
        component={HomeScreen}
        options={{
          tabBarLabel: "Compte",
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
