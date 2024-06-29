import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  View,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Layout, Text, Card } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../api/axios";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";

interface Reservation {
  _id: string;
  user_id: string;
  date_debut: string;
  end_date: string;
  reservation_status: string;
  createdAt: string;
  updatedAt: string;
  room_id: {
    name: string;
    price: number;
    images: string[];
  };
}

type RootStackParamList = {
  Room: undefined;
  RoomList: undefined;
  Salle: { roomId: string };
  Favoris: undefined;
  Reserver: undefined;
  Reservation: { roomId: string };
  ReservationDetail: { reservation: Reservation };
  Notification: undefined;
  Account: undefined;
};

type ReservationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Reservation"
>;

type Props = {
  navigation: ReservationScreenNavigationProp;
};

const ReservationScreen: React.FC<Props> = ({ navigation }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

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

  useEffect(() => {
    fetchReservations();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
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
    <Card
      style={styles.card}
      onPress={() =>
        navigation.navigate("ReservationDetail", { reservation: item })
      }
    >
      <Text category="h6">Réservation ID: {item._id}</Text>
      <Text category="s1">Salle: {item.room_id.name}</Text>
      <Text category="s1">Prix: {item.room_id.price} €</Text>
      <Text category="s1">
        Date de début: {new Date(item.date_debut).toLocaleDateString()}
      </Text>
      <Text category="s1">
        Date de fin: {new Date(item.end_date).toLocaleDateString()}
      </Text>
      <Text category="s1">Status: {item.reservation_status}</Text>
      <Text category="c1">
        Créé le: {new Date(item.createdAt).toLocaleDateString()}
      </Text>
      <Text category="c1">
        Mis à jour le: {new Date(item.updatedAt).toLocaleDateString()}
      </Text>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() =>
          navigation.navigate("ReservationDetail", { reservation: item })
        }
      >
        <Icon name="arrow-forward" style={styles.icon} />
      </TouchableOpacity>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={reservations}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
  iconContainer: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default ReservationScreen;
