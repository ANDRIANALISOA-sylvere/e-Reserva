import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { Text, Divider, Button, Layout } from "@ui-kitten/components";
import axios from "../../api/axios";

interface Reservation {
  _id: string;
  user_id: {
    name: string;
  };
  date_debut: string;
  end_date: string;
  reservation_status: string;
  createdAt: string;
  updatedAt: string;
  room_id: {
    name: string;
    price: number;
    images: string[];
    equipments: string[];
  };
}

type RootStackParamList = {
  Room: undefined;
  RoomList: undefined;
  Salle: { roomId: string };
  ReservationRoom: { roomId: string };
  Favoris: undefined;
  Reserver: undefined;
  Reservation: { roomId: string };
  ReservationDetail: { reservation: Reservation };
  RoomUser: undefined;
  Account: undefined;
  AddRoom: undefined;
  Salles: undefined;
};

type RoomDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ReservationRoom"
>;

type RoomDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "ReservationRoom"
>;

interface RoomDetailProps {
  navigation: RoomDetailScreenNavigationProp;
  route: RoomDetailScreenRouteProp;
}

const ReservationOfRoom: React.FC<RoomDetailProps> = ({
  route,
  navigation,
}) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { roomId } = route.params;

  const fetchReservations = useCallback(async () => {
    try {
      const response = await axios.get(`/reservations/room/${roomId}`);
      setReservations(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
    }
  }, [roomId]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchReservations();
    setRefreshing(false);
  }, [fetchReservations]);

  const handleConfirm = async (reservationId: string) => {
    try {
      const response = await axios.patch(
        `/reservations/${reservationId}/confirm`
      );
      if (response.status === 200) {
        setReservations((prevReservations) =>
          prevReservations.map((reservation) =>
            reservation._id === reservationId
              ? { ...reservation, reservation_status: "confirmed" }
              : reservation
          )
        );
        Alert.alert("Succès", "La réservation a été confirmée");
      }
    } catch (error) {
      console.error("Erreur lors de la confirmation de la réservation:", error);
      Alert.alert("Erreur", "Impossible de confirmer la réservation");
    }
  };

  const handleCancel = async (reservationId: string) => {
    try {
      const response = await axios.patch(
        `/reservations/${reservationId}/cancel`
      );
      if (response.status === 200) {
        setReservations((prevReservations) =>
          prevReservations.map((reservation) =>
            reservation._id === reservationId
              ? { ...reservation, reservation_status: "cancelled" }
              : reservation
          )
        );
        Alert.alert("Succès", "La réservation a été annulée");
      }
    } catch (error) {
      console.error("Erreur lors de l'annulation de la réservation:", error);
      Alert.alert("Erreur", "Impossible d'annuler la réservation");
    }
  };

  const getStatusInFrench = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "confirmed":
        return "Confirmée";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {reservations.map((reservation, index) => (
        <View key={reservation._id}>
          <View style={styles.reservationCard}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: reservation.room_id.images[0] }}
                style={styles.image}
              />
            </View>
            <View style={styles.infoContainer}>
              <Text style={{ fontFamily: "Poppins-Bold" }}>
                {reservation.room_id.name}
              </Text>
              <Text style={{ fontFamily: "Poppins" }}>
                Réservé par: {reservation.user_id.name}
              </Text>
              <Text style={{ fontFamily: "Poppins" }}>
                Du: {new Date(reservation.date_debut).toLocaleDateString()}
              </Text>
              <Text style={{ fontFamily: "Poppins" }}>
                Au: {new Date(reservation.end_date).toLocaleDateString()}
              </Text>
              <Text style={{ fontFamily: "Poppins" }}>
                Prix: {reservation.room_id.price} Ar
              </Text>
              <Text style={{ fontFamily: "Poppins" }}>
                Statut: {getStatusInFrench(reservation.reservation_status)}
              </Text>
              <View style={styles.buttonContainer}>
                {reservation.reservation_status === "pending" && (
                  <>
                    <Button
                      size="filled"
                      status="success"
                      onPress={() => handleConfirm(reservation._id)}
                    >
                      Confirmer
                    </Button>
                    <Button
                      size="filled"
                      status="danger"
                      onPress={() => handleCancel(reservation._id)}
                    >
                      Annuler
                    </Button>
                  </>
                )}
              </View>
            </View>
          </View>
          {index < reservations.length - 1 && (
            <Divider style={styles.divider} />
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  reservationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
  },
  imageContainer: {
    width: "40%",
    marginRight: 16,
  },
  image: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  divider: {
    marginVertical: 8,
  },
});

export default ReservationOfRoom;
