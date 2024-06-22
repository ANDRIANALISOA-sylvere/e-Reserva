import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RoomListScreen from "../screens/RoomListScreen";
import MainNavigator from './MainNavigator'

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
            component={MainNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
    </>
  );
};

export default AppNavigator;
