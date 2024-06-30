import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  View,
  RefreshControl,
} from "react-native";
import { MenuItem, Layout, Text, Divider } from "@ui-kitten/components";
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

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Reservation }) => (
    <View>
      <MenuItem
        title={(evaProps) => (
          <Layout style={styles.titleContainer}>
            <Text
              {...evaProps}
            >{`${item.room_id.name} - ${item.room_id.price} Ar/h`}</Text>
          </Layout>
        )}
        accessoryLeft={CalendarIcon}
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
        <View style={{marginBottom:30}}>
          <View style={styles.header}>
            <Text category="h4">Liste des reservations</Text>
            <Divider></Divider>
          </View>
          <FlatList
            data={reservations}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ItemSeparatorComponent={() => <Divider />}
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
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    margin: 20,
    padding: 5,
  },
  noReservations: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ReservationScreen;
