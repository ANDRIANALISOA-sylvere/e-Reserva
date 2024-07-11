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

  const renderItem = ({ item }: { item: Reservation }) => (
    <View style={styles.reservationItem}>
      <MenuItem
        title={(evaProps) => (
          <Layout style={styles.titleContainer}>
            <Text {...evaProps} style={styles.roomName}>
              {item.room_id.name}
            </Text>
            <Text {...evaProps} style={styles.dateText}>
              {formatDate(item.createdAt)}
            </Text>
          </Layout>
        )}
        accessoryLeft={(props) => (
          <Image
            source={{ uri: item.room_id.images[0] }}
            style={styles.roomImage}
          />
        )}
        accessoryRight={ForwardIcon}
        onPress={() =>
          navigation.navigate("ReservationDetail", { reservation: item })
        }
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {reservations.length === 0 ? (
        <View style={styles.noReservations}>
          <Text category="h6">Aucune reservation</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: "Poppins" }}>Avez-vous une salle ?</Text>
            <Button 
  size="small" 
  onPress={() => navigation.navigate("AddRoom")}
>
  {evaProps => <Text {...evaProps} style={styles.buttonText}>Ajouter une salle</Text>}
</Button>
          </View>
          <View style={styles.header}>
            <Text style={{ fontFamily: "Poppins-Bold" }}>
              Liste des reservations
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
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
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
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  header: {
    margin: 15,
    padding: 5,
  },
  noReservations: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  reservationItem: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  separator: {
    height: 10,
  },
  roomImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  buttonText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color:"white"
  },
});

export default ReservationScreen;
