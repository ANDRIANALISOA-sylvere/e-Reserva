import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RoomListScreen from "../screens/RoomListScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RoomList"
            component={RoomListScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
    </>
  );
};

export default AppNavigator;
