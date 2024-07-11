import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  View,
  RefreshControl,
  Image,
} from "react-native";
import { MenuItem, Layout, Text, Button } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../api/axios";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome";

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

interface Room {
  _id: string;
  name: string;
  owner_id: string;
  max_capacity: number;
  price: number;
  description: string;
  equipments: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
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

type RoomScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Salle"
>;

type Props = {
  navigation: RoomScreenNavigationProp;
};

const RoomUser: React.FC<Props> = ({ navigation }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchRooms = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        const userId = user._id;
        const response = await axios.get(`/rooms?owner_id=${userId}`);
        setRooms(response.data.rooms);
      } else {
        console.log("User data not found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error fetching rooms: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    fetchRooms();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Room }) => (
    <View style={styles.roomItem}>
      <MenuItem
        title={(evaProps) => (
          <View style={styles.titleContainer}>
            <Text {...evaProps} style={styles.roomName}>
              {item.name}
            </Text>
            <Text {...evaProps} style={styles.dateText}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}
        accessoryLeft={(props) => (
          <Image source={{ uri: item.images[0] }} style={styles.roomImage} />
        )}
        accessoryRight={() => <Icon name="angle-right" size={20} />}
        onPress={() => navigation.navigate("Salle", { roomId: item._id })}
        style={{ backgroundColor: "#F8F8F8", borderRadius: 5 }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontFamily: "Poppins-Bold" }}>Liste des salles</Text>
        <Button size="small" onPress={() => navigation.navigate("AddRoom")}>
          Ajouter une salle
        </Button>
      </View>
      <FlatList
        data={rooms}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.noReservations}>
            <Text category="h6">Aucune salle</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noRooms: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  roomItem: {
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
});

export default RoomUser;
