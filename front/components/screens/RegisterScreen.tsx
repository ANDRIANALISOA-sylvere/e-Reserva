import React, { useState } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import axios from "../../api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Input, Text, useTheme } from "@ui-kitten/components";

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const theme = useTheme();

  const handleRegister = async () => {
    if (!name || !email || !password || !phone) {
      Alert.alert("Alerte", "Tous les champs sont obligatoires");
    } else {
      try {
        const response = await axios.post("/register", {
          name: name,
          email: email,
          password: password,
          phone: phone,
          role: "organisateur",
        });
        const token = response.data.token;
        const user = response.data.user;

        await AsyncStorage.setItem("user", JSON.stringify(user));
        await AsyncStorage.setItem("token", token);
        navigation.replace("RoomList");
      } catch (error: any) {
        Alert.alert("Inscription échouée", error.message + " erreur");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>
      <Text style={styles.instructions}>
        Remplissez le formulaire pour créer votre compte.
      </Text>
      <Image
        source={require("../../assets/images/Register.png")}
        style={styles.image}
      />
      <Input
        placeholder="Nom"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <Input
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Input
        placeholder="Téléphone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <Button
        status="primary"
        onPress={handleRegister}
        style={{ marginTop: 20, width: "100%" }}
      >
        S'inscrire
      </Button>
      <Text style={styles.loginLink}>
        Vous avez déjà un compte ?{" "}
        <Text
          style={{
            color: theme["color-primary-500"],
            fontFamily: "Poppins-Bold",
          }}
          onPress={() => navigation.navigate("Login")}
        >
          Connectez-vous
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
    fontSize: 14,
  },
  input: {
    width: "100%",
    marginBottom: 10,
    fontFamily: "Poppins",
  },
  loginLink: {
    marginTop: 20,
    fontFamily: "Poppins",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default RegisterScreen;
