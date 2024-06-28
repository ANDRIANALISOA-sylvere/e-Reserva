import React, { useState } from "react";
import { View, StyleSheet, TextInput, Alert } from "react-native";
import axios from "../../api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Input, Text, useTheme } from "@ui-kitten/components";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const theme = useTheme();

  const handleLogin = async () => {
    try {
      const response = await axios.post("/login", {
        email: email,
        password: password,
      });
      const token = response.data.token;
      const user = response.data.user;

      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("token", token);
      navigation.replace("RoomList");
    } catch (error: any) {
      Alert.alert("Login failed", error.message + " erreur");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Input
        placeholder="Email"
        value={email}
        status="primary"
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder="Password"
        value={password}
        style={{ marginTop: 10 }}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button status="warning" appearance="outline" onPress={handleLogin}>
        Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default LoginScreen;
