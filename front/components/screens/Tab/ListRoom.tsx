import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Image,
  StyleSheet,
  View,
  Text,
  FlatList,
} from "react-native";
import axios from "../../../api/axios";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

interface Room {
  _id: string;
  name: string;
  owner_id: {
    name: string;
  };
  price: string;
  max_capacity: number;
  description: string;
  equipments: string[];
  images: string[];
  averageRating?: number;
  reviewCount?: number;
}

interface Props {
  navigation: any;
  refreshKey: number;
}

const ListRoom: React.FC<Props> = ({ navigation, refreshKey }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const roomsPerPage = 5;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get<{ rooms: Room[] }>("/rooms/all");
        const roomsWithReviews = await Promise.all(
          response.data.rooms.map(async (room) => {
            const reviewResponse = await axios.get(
              `/reviews?room_id=${room._id}`
            );
            return {
              ...room,
              averageRating: reviewResponse.data.averageRating,
              reviewCount: reviewResponse.data.reviewCount,
            };
          })
        );
        setRooms(roomsWithReviews);
      } catch (error) {
        console.log("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, [refreshKey]);

  const handleRoomPress = (roomId: string) => {
    navigation.navigate("Salle", { roomId });
  };

  const renderRoomRow = ({ item, index }: { item: any; index: number }) => {
    const startIndex = index * roomsPerPage;
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.rowContainer}
      >
        {rooms.slice(startIndex, startIndex + roomsPerPage).map((room) => (
          <TouchableOpacity
            key={room._id}
            style={styles.roomContainer}
            onPress={() => handleRoomPress(room._id)}
          >
            <Image
              source={{ uri: room.images[0] }}
              style={styles.image}
              onError={() => console.log("Image load error")}
            />
            <View style={styles.body}>
              <Text style={styles.name}>{room.name}</Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={16} color="orange" />
                <Text style={styles.ratingText}>
                  {room.averageRating?.toFixed(1) || "N/A"} (
                  {room.reviewCount || 0})
                </Text>
              </View>
              <Text style={styles.capacity}>
                Capacité: {room.max_capacity} pers
              </Text>
              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>{room.price} Ar / h</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <FlatList
      data={Array(Math.ceil(rooms.length / roomsPerPage)).fill(0)}
      renderItem={renderRoomRow}
      keyExtractor={(_, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.flatListContent}
    />
  );
};

const styles = StyleSheet.create({
  flatListContent: {
    paddingBottom: 20,
  },
  rowContainer: {
    marginBottom: 10,
  },
  roomContainer: {
    width: 180,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 160,
    borderTopRightRadius: 10,
  },
  name: {
    marginBottom: 5,
    fontFamily: "Poppins-Bold",
  },
  owner: {
    opacity: 0.6,
    marginBottom: 5,
    fontFamily: "Poppins",
  },
  capacity: {
    marginBottom: 5,
    opacity: 0.6,
    fontFamily: "Poppins",
  },
  description: {
    marginBottom: 5,
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  body: {
    backgroundColor: "#F8F8F8",
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
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
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 12,
    color: "#666",
    fontFamily: "Poppins",
  },
});

export default ListRoom;
