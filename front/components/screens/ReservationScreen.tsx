import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
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
    <View style={styles.item}>
      <Text style={styles.title}>Réservation ID: {item._id}</Text>
      <Text>
        Date de début: {new Date(item.date_debut).toLocaleDateString()}
      </Text>
      <Text>Date de fin: {new Date(item.end_date).toLocaleDateString()}</Text>
      <Text>Status: {item.reservation_status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reservations}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ReservationScreen;
