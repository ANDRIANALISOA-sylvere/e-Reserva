import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "../../api/axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/FontAwesome";
import Material from "react-native-vector-icons/MaterialIcons";
import { Divider, useTheme } from "@ui-kitten/components";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

type RootStackParamList = {
  RoomList: undefined;
  Salle: { roomId: string };
};

type RoomDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Salle"
>;

type RoomDetailScreenRouteProp = RouteProp<RootStackParamList, "Salle">;

interface RoomDetailProps {
  navigation: RoomDetailScreenNavigationProp;
  route: RoomDetailScreenRouteProp;
}

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
  const theme = useTheme();
  const iconColor = theme["color-basic-600"];

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get<{ room: Room }>(`/rooms/${roomId}`);
        setRoom(response.data.room);
      } catch (error) {
        console.log("Error fetching room details:", error);
      }
    };

    const fetchRoomReviews = async () => {
      try {
        const response = await axios.get<{ review: Review[] }>(
          `/reviews?room_id=${roomId}`
        );
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
    <ScrollView style={styles.container}>
      <Image source={{ uri: room.images[0] }} style={styles.image} />
      <TouchableOpacity style={styles.favIcon}>
        <Ionicons name="heart-outline" size={20} color="#fff" />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{room.name}</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Material name="people" size={24} color={iconColor} />
            <Text style={styles.infoText}>{room.max_capacity} personnes</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="user-o" size={20} color={iconColor} />
            <Text style={styles.infoText}>{room.owner_id.name}</Text>
          </View>
        </View>
        <Divider style={styles.divider} />
        <Text style={styles.price}>{room.price} Ar / heure</Text>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{room.description}</Text>
        {room.equipments && room.equipments.length > 1 && (
          <>
            <Text style={styles.sectionTitle}>Équipements</Text>
            <View style={styles.equipmentsContainer}>
              {room.equipments.map((equipment, index) => (
                <View key={index} style={styles.badge}>
                  <Text style={styles.badgeText}>{equipment}</Text>
                </View>
              ))}
            </View>
          </>
        )}
        <Text style={styles.sectionTitle}>Avis</Text>
        {reviews.length > 0 ? (
          <View>
            {reviews.map((item) => (
              <View key={item._id} style={styles.reviewContainer}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.userName}>{item.user_id.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.rating}>{item.rating}</Text>
                  </View>
                </View>
                <Text style={styles.comment}>{item.comment}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noReviews}>Aucun avis pour cette salle.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 250,
  },
  favIcon: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 50,
    padding: 4,
  },
  contentContainer: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#666",
  },
  divider: {
    backgroundColor: "#e0e0e0",
    marginVertical: 15,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4FC934",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  equipmentsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  badge: {
    backgroundColor: "black",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: "white",
    fontSize: 14,
  },
  reviewContainer: {
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    marginLeft: 4,
    color: "#FFD700",
  },
  comment: {
    fontSize: 14,
    color: "#555",
  },
  noReviews: {
    fontSize: 16,
    color: "#888",
    fontStyle: "italic",
  },
});

export default RoomDetailScreen;
