import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Button, Text, View } from "react-native";

function AccountScreen({ navigation }: any) {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      navigation.replace("Login");
    } catch (error) {
      console.error("Error during logout: ", error);
    }
  };
  return (
    <View>
      <Button title="Logout" onPress={handleLogout}></Button>
    </View>
  );
}

export default AccountScreen;
