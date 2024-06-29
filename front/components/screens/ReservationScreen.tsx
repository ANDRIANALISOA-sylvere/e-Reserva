import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  View
} from "react-native";
import { Layout, Text, Card, Spinner } from '@ui-kitten/components';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../api/axios";

interface Reservation {
  _id: string;
  room_id: string;
  user_id: string;
  date_debut: string;
  end_date: string;
  reservation_status: string;
  createdAt: string;
  updatedAt: string;
}

const ReservationScreen: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          const userId = user._id;
          const response = await axios.get(`/reservations?user_id=${userId}`);
          setReservations(response.data.reservation);
        } else {
          console.log("User data not found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error fetching reservations: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Reservation }) => (
    <Card style={styles.card}>
      <Text category='h6'>Réservation ID: {item._id}</Text>
      <Text category='s1'>Salle ID: {item.room_id}</Text>
      <Text category='s1'>Utilisateur ID: {item.user_id}</Text>
      <Text category='s1'>Date de début: {new Date(item.date_debut).toLocaleDateString()}</Text>
      <Text category='s1'>Date de fin: {new Date(item.end_date).toLocaleDateString()}</Text>
      <Text category='s1'>Status: {item.reservation_status}</Text>
      <Text category='c1'>Créé le: {new Date(item.createdAt).toLocaleDateString()}</Text>
      <Text category='c1'>Mis à jour le: {new Date(item.updatedAt).toLocaleDateString()}</Text>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={reservations}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  card: {
    marginVertical: 8,
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ReservationScreen;
