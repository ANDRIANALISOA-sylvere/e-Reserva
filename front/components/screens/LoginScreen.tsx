import React, { useState } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import axios from "../../api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Input, Text, useTheme } from "@ui-kitten/components";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const theme = useTheme();

  const handleLogin = async () => {
    if (!email && !password) {
      Alert.alert("Alerte", "Tous les champs sont obligatoires");
    } else {
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
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue !</Text>
      <Text style={styles.instructions}>
        Entrez vos identifiants pour vous connecter.
      </Text>
      <Image
        source={require("../../assets/images/login.png")}
        style={styles.image}
      />
      <Input
        placeholder="Email"
        value={email}
        status="primary"
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <Input
        placeholder="Password"
        value={password}
        style={[styles.input, { marginTop: 10 }]}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        status="primary"
        onPress={handleLogin}
        style={{ marginTop: 20, width: "100%" }}
      >
        Connexion
      </Button>
      <Text style={styles.registerLink}>
        Vous n'avez pas de compte ?{" "}
        <Text
          style={{
            color: theme["color-primary-500"],
            fontFamily: "Poppins-Bold",
          }}
          onPress={() => navigation.navigate("Register")}
        >
          S'inscrire
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 32,
    fontFamily: "Poppins-Bold",
    marginBottom: 10,
  },
  instructions: {
    fontFamily: "Poppins",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 10,
    fontFamily: "Poppins",
  },
  registerLink: {
    marginTop: 20,
    fontFamily: "Poppins",
  },
});

export default LoginScreen;
