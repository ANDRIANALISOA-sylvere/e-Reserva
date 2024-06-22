import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        navigation.replace("RoomList");
      } else {
        navigation.replace("Login");
      }
    };

    setTimeout(checkToken, 4000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>e-Reserva</Text>
      <ActivityIndicator size="large" color="#fff" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFA500",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "bold",
  },
  loader: {
    marginTop: 40,
  },
});

export default SplashScreen;
