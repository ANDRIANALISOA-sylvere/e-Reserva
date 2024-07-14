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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native";

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

const RoomDetailScreen: React.FC<RoomDetailProps> = ({ route, navigation }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [userId, setUserId] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
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
        const response = await axios.get<{
          reviews: Review[];
          reviewCount: number;
          averageRating: number;
        }>(`/reviews?room_id=${roomId}`);
        setReviews(response.data.reviews);
        setReviewCount(response.data.reviewCount);
        setAverageRating(response.data.averageRating);
      } catch (error) {
        console.log("Error fetching room reviews:", error);
      }
    };
    const fetchFavoriteStatus = async () => {
      try {
        const response = await axios.get(`/check/${userId}/${roomId}`);
        setIsFavorite(response.data.estFavori);
      } catch (error) {
        console.error(
          "Erreur lors de la vérification du statut favori:",
          error
        );
      }
    };

    if (userId) {
      fetchFavoriteStatus();
    }

    fetchRoomDetails();
    fetchRoomReviews();
  }, [roomId, userId]);

  useEffect(() => {
    const fetchUserId = async () => {
      const userString = await AsyncStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        setUserId(user._id);
      }
    };
    fetchUserId();
  }, []);

  const toggleFavorite = async () => {
    try {
      const newFavoriteStatus = !isFavorite;
      await axios.post("/update", {
        userId: userId,
        roomId: roomId,
        isFavoris: newFavoriteStatus,
      });
      setIsFavorite(newFavoriteStatus);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du favori:", error);
      alert("Une erreur est survenue lors de la mise à jour du favori.");
    }
  };

  const handleRatingPress = (rating: number) => {
    setUserRating(rating);
  };

  const submitReview = async () => {
    if (userRating === 0) {
      alert("Veuillez donner une note avant de soumettre.");
      return;
    }
    try {
      const response = await axios.post("/reviews", {
        room_id: roomId,
        user_id: userId,
        rating: userRating,
        comment: userComment,
      });
      setReviews([...reviews, response.data.review]);
      setUserRating(0);
      setUserComment("");
      alert("Avis ajouté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'avis:", error);
      alert("Une erreur est survenue lors de l'ajout de l'avis.");
    }
  };

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
        <Pressable style={styles.favIcon} onPress={toggleFavorite}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={20}
            color={isFavorite ? "red" : "#fff"}
          />
        </Pressable>
        <Text style={styles.name}>{room.name}</Text>
        <View style={styles.ratingOverview}>
          <Text style={styles.averageRating}>{averageRating.toFixed(1)}</Text>
          <View style={styles.starsContainer}>
            {renderRatingStars(averageRating)}
          </View>
          <Text style={styles.reviewCount}>({reviewCount} avis)</Text>
        </View>
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
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{room.price} Ar / heure</Text>
        </View>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{room.description}</Text>
        {room.equipments && room.equipments.length > 1 && (
          <>
            <Text style={styles.sectionTitle}>Équipements</Text>
            <View style={styles.equipmentsContainer}>
              {room.equipments.map((equipment, index) => (
                <View key={index} style={styles.equipmentBadge}>
                  <Text style={styles.equipmentText}>{equipment}</Text>
                </View>
              ))}
            </View>
          </>
        )}
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
          Réserver cette salle
        </Button>
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
      <View style={styles.addReviewContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.sectionTitle}>Ajouter un avis</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => handleRatingPress(star)}>
                <Ionicons
                  name={star <= userRating ? "star" : "star-outline"}
                  size={20}
                  color={star <= userRating ? "orange" : iconColor}
                />
              </Pressable>
            ))}
          </View>
        </View>
        <TextInput
          style={styles.commentInput}
          placeholder="Écrivez votre commentaire ici"
          value={userComment}
          onChangeText={setUserComment}
          multiline
        />
        <Button
          style={styles.submitReviewButton}
          onPress={submitReview}
          status="success"
        >
          Soumettre l'avis
        </Button>
      </View>
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
    fontFamily: "Poppins-Bold",
  },
  name: {
    fontSize: 24,
    marginBottom: 15,
    marginTop: 20,
    fontFamily: "Poppins-Bold",
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
    fontFamily: "Poppins",
  },
  divider: {
    backgroundColor: "#e0e0e0",
    marginVertical: 15,
  },
  priceBadge: {
    backgroundColor: "#E8F5E9",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  priceText: {
    color: "#2E7D32",
    fontFamily: "Poppins-Bold",
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
    fontFamily: "Poppins-Bold",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "justify",
    opacity: 0.3,
    fontFamily: "Poppins",
  },
  equipmentsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
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
  reserveButton: {
    marginTop: 20,
    margin: 10,
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
  equipmentBadge: {
    backgroundColor: "#E3F2FD",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  equipmentText: {
    color: "#1565C0",
    fontFamily: "Poppins-Bold",
    fontSize: 12,
  },
  addReviewContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
    gap: 10,
  },
  commentInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 15,
  },
  submitReviewButton: {
    marginTop: 10,
  },
  ratingOverview: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  averageRating: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 10,
  },
  starsContainer: {
    flexDirection: "row",
  },
  reviewCount: {
    marginLeft: 10,
    color: "#666",
  },
});

export default RoomDetailScreen;
