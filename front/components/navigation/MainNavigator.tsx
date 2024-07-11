import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Material from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/FontAwesome";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import Account from "../screens/AccountScreen";
import RoomListScreen from "../screens/RoomListScreen";
import RoomDetailsScreen from "../screens/RoomDetailScreen";
import FavorisScreen from "../screens/FavorisScreen";
import ReservationScreen from "../screens/ReservationScreen";
import ReservationModalScreen from "../screens/ReservationModalScreen";
import ReservationDetailScreen from "../screens/ReservationDetailScreen";
import { useTheme } from "@ui-kitten/components";
import Room from "../screens/Room";
import RoomUser from "../screens/RoomUser";

interface Reservation {
  _id: string;
  user_id: string;
  date_debut: string;
  end_date: string;
  reservation_status: string;
  createdAt: string;
  updatedAt: string;
  room_id: {
    name: string;
    price: number;
    images: string[];
  };
}

type RootStackParamList = {
  Room: undefined;
  RoomList: undefined;
  Salle: { roomId: string };
  Favoris: undefined;
  Reserver: undefined;
  Reservation: { roomId: string };
  ReservationDetail: { reservation: Reservation };
  RoomUser: undefined;
  Account: undefined;
  AddRoom: undefined;
  Salles : undefined
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
      <RootStack.Screen
        name="Reservation"
        component={ReservationModalScreen}
        options={{
          headerShown: true,
          title: "Réservation de salle",
          headerTitleStyle: {
            fontFamily: "Poppins-Bold",
            fontSize: 18,
          },
        }}
      />
    </RootStack.Group>
  </Stack.Navigator>
);

const ReservationStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Reservation"
      component={ReservationScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ReservationDetail"
      component={ReservationDetailScreen}
      options={{ headerShown: true, title: "Détails de la réservation" }}
    />
  </Stack.Navigator>
);

const SalleStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="RoomUser"
      component={RoomUser}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AddRoom"
      component={Room}
      options={{ headerShown: true, title: "Nouvelle salle" }}
    />
  </Stack.Navigator>
);

export default function MainNavigator() {
  const theme = useTheme();
  const iconColor = theme["color-basic-600"];
  const [loaded, error] = useFonts({
    Poppins: require("../../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <Tab.Navigator
      initialRouteName="Room"
      screenOptions={{
        tabBarActiveTintColor: "#FF835C",
        tabBarInactiveTintColor: iconColor,
        tabBarLabelStyle: { fontFamily: "Poppins" },
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
        component={ReservationStack}
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
        name="Salles"
        component={SalleStack}
        options={{
          tabBarLabel: "Salles",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Icon
              name={focused ? "building" : "building-o"}
              color={color}
              size={size}
            />
          ),
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
