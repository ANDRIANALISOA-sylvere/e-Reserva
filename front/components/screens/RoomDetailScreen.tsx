import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import axios from "../../api/axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/FontAwesome";
import Material from "react-native-vector-icons/MaterialIcons";
import { Button, Divider, useTheme } from "@ui-kitten/components";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import Swiper from "react-native-swiper";

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

const { width: viewportWidth } = Dimensions.get('window');

const RoomDetailScreen: React.FC<RoomDetailProps> = ({ route, navigation }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const roomId = route.params.roomId;
  console.log("Room ID:", roomId);
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

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const filledStars = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= filledStars) {
        stars.push(<Ionicons key={i} name="star" size={16} color="orange" />);
      } else {
        stars.push(
          <Ionicons key={i} name="star" size={16} color={iconColor} />
        );
      }
    }
    return stars;
  };

  if (!room) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        {room.images.length > 1 ? (
          <Swiper
            style={styles.wrapper}
            showsButtons={true}
            nextButton={<Text style={styles.buttonText}>›</Text>}
            prevButton={<Text style={styles.buttonText}>‹</Text>}
          >
            {room.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} />
            ))}
          </Swiper>
        ) : (
          <Image source={{ uri: room.images[0] }} style={styles.image} />
        )}
        <Pressable style={styles.favIcon}>
          <Ionicons name="heart-outline" size={20} color="#fff" />
        </Pressable>
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
        <Text style={styles.sectionTitle}>Localisation</Text>
        <Image
          style={styles.localisation}
          source={require("../../assets/images/Capture d’écran_2024-06-30_11-00-10.png")}
        />
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
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww",
                    }}
                    style={styles.avatar}
                  />
                  <Text style={styles.userName}>{item.user_id.name}</Text>
                  <View style={styles.ratingContainer}>
                    {renderRatingStars(item.rating)}
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
      <Button
        style={styles.reserveButton}
        onPress={() => navigation.navigate("Reservation", { roomId: roomId })}
        accessoryLeft={(props) => (
          <Ionicons
            {...props}
            color="white"
            size={20}
            name="checkmark-circle"
          />
        )}
      >
        Réserver
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  wrapper: {
    height: 250,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 5,
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
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 50,
    fontWeight: "bold",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 20,
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
    textAlign: "justify",
    opacity: 0.5,
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
    borderRadius: 5,
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
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  rating: {
    fontSize: 14,
    marginLeft: 4,
    color: "#FFD700",
  },
  comment: {
    fontSize: 14,
    color: "#555",
    opacity: 0.6,
  },
  noReviews: {
    fontSize: 16,
    color: "#888",
    fontStyle: "italic",
  },
  reserveButton: {
    marginTop: 20,
    margin: 10
  },
  addReviewButton: {
    marginBottom: 15,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  localisation: {
    width: "100%",
    marginTop: 10,
    height: 200,
  },
});

export default RoomDetailScreen;