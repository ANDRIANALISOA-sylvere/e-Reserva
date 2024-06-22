import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../api/axios';


const RoomListScreen = ({navigation}:any) => {
  const handlelogout=async()=>{
    await AsyncStorage.removeItem("token");
    navigation.replace("Login")
  }
  return (
    <View>
      <Text>Room List</Text>
      <Button title="Logout" onPress={handlelogout}></Button>
    </View>
  );
};

const styles = StyleSheet.create({});

export default RoomListScreen;
