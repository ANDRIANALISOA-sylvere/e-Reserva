import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import axios from "../../api/axios";
import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

interface RoomDetailProps {
  navigation: RoomDetailScreenNavigationProp;
  route: RoomDetailScreenRouteProp;
}

type RootStackParamList = {
  RoomList: undefined;
  Salle: { roomId: string };
};

type RoomDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Salle"
>;
type RoomDetailScreenRouteProp = RouteProp<RootStackParamList, "Salle">;

interface Room {
  _id: string;
  name: string;
  owner_id: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  max_capacity: number;
  description: string;
  equipments: string[];
  images: string[];
  price: number;
}

interface Review {
  _id: string;
  user_id: {
    _id: string;
    name: string;
  };
  comment: string;
  rating: number;
}

const RoomDetailScreen: React.FC<RoomDetailProps> = ({ route }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const roomId = route.params.roomId;

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`/rooms/${roomId}`);
        setRoom(response.data.room);
      } catch (error) {
        console.log("Error fetching room details:", error);
      }
    };

    const fetchRoomReviews = async () => {
      try {
        const response = await axios.get(`/reviews?room_id=${roomId}`);
        setReviews(response.data.review);
      } catch (error) {
        console.log("Error fetching room reviews:", error);
      }
    };

    fetchRoomDetails();
    fetchRoomReviews();
  }, [roomId]);

  if (!room) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: room.images[0] }} style={styles.image} />
      <Text style={styles.name}>{room.name}</Text>
      <Text style={styles.owner}>Owner: {room.owner_id.name}</Text>
      <Text style={styles.capacity}>
        Capacity: {room.max_capacity} personnes
      </Text>
      <Text style={styles.price}>Price: {room.price} Ar</Text>
      <Text style={styles.description}>{room.description}</Text>

      <Text style={styles.sectionTitle}>Équipements:</Text>
      <View style={styles.equipmentsContainer}>
        {room.equipments.map((equipment, index) => (
          <View key={index} style={styles.badge}>
            <Text style={styles.badgeText}>{equipment}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Avis:</Text>
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          renderItem={({ item }) => (
            <View style={styles.reviewContainer}>
              <Text style={styles.userName}>{item.user_id.name}</Text>
              <Text style={styles.comment}>{item.comment}</Text>
              <Text style={styles.rating}>Rating: {item.rating}</Text>
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
      ) : (
        <Text>Aucun avis pour cette salle.</Text>
      )}

      <TouchableOpacity style={styles.favIcon}>
        <Ionicons name="star-outline" size={30} color="#FFD700" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  owner: {
    fontSize: 18,
    marginBottom: 10,
  },
  capacity: {
    fontSize: 18,
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    marginBottom: 10,
    color: "green",
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  equipmentsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  badge: {
    backgroundColor: "#333",
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  badgeText: {
    color: "#FFF",
  },
  reviewContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#F0F0F0",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  comment: {
    fontSize: 16,
    marginBottom: 5,
  },
  rating: {
    fontSize: 14,
    color: "#888",
  },
  favIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default RoomDetailScreen;
