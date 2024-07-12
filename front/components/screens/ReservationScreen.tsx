import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  View,
  RefreshControl,
  Image,
} from "react-native";
import { MenuItem, Layout, Text, Divider, Button } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../api/axios";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontIcon from "react-native-vector-icons/FontAwesome";

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
    createdAt: string;
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
  AddRoom: undefined;
};

type ReservationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Reservation"
>;

type Props = {
  navigation: ReservationScreenNavigationProp;
};

const CalendarIcon = (props: any) => (
  <Layout {...props} style={[props.style, styles.iconContainer]}>
    <AntDesign name="calendar" size={20} />
  </Layout>
);

const ForwardIcon = (props: any) => (
  <Layout {...props} style={[props.style, styles.iconContainer]}>
    <Icon name="arrow-redo-outline" size={20} />
  </Layout>
);

const ReservationScreen: React.FC<Props> = ({ navigation }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderStatusBadge = (status: string) => {
    let backgroundColor, textColor, displayText;
    switch (status) {
      case "pending":
        backgroundColor = "#FFF3E0";
        textColor = "#FF9800";
        displayText = "En attente";
        break;
      case "confirmed":
        backgroundColor = "#E8F5E9";
        textColor = "#4CAF50";
        displayText = "Confirmée";
        break;
      case "cancelled":
        backgroundColor = "#FFEBEE";
        textColor = "#F44336";
        displayText = "Annulée";
        break;
      default:
        backgroundColor = "#F5F5F5";
        textColor = "#9E9E9E";
        displayText = "Inconnu";
    }
    return (
      <View style={[styles.statusBadge, { backgroundColor }]}>
        <Text style={[styles.statusBadgeText, { color: textColor }]}>
          {displayText}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Reservation }) => (
    <View style={styles.reservationItem}>
      <MenuItem
        title={(evaProps) => (
          <View style={styles.titleContainer}>
            <Text {...evaProps} style={styles.roomName}>
              {item.room_id.name}
            </Text>
            <View style={styles.dateStatusContainer}>
              <Text {...evaProps} style={styles.dateText}>
                {formatDate(item.createdAt)}
              </Text>
              {renderStatusBadge(item.reservation_status)}
            </View>
          </View>
        )}
        accessoryLeft={(props) => (
          <Image
            source={{ uri: item.room_id.images[0] }}
            style={styles.roomImage}
          />
        )}
        accessoryRight={() => <FontIcon name="angle-right" size={20} />}
        onPress={() =>
          navigation.navigate("ReservationDetail", { reservation: item })
        }
        style={{ backgroundColor: "#F8F8F8", borderRadius: 5 }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontFamily: "Poppins-Bold" }}>
          Liste des réservations
        </Text>
      </View>
      <FlatList
        data={reservations}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.noReservations}>
            <Text category="h6">Aucune réservation</Text>
          </View>
        )}
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 20,
  },
  roomName: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  dateText: {
    fontSize: 14,
    color: "#888",
  },
  header: {
    margin: 15,
    padding: 5,
  },
  reservationItem: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 5,
  },
  separator: {
    height: 10,
  },
  roomImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  noReservations: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 300,
  },
  dateStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontFamily: "Poppins-Bold",
  },
});

export default ReservationScreen;
