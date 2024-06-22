import React, { useEffect, useState } from "react";
import { ScrollView, Image, StyleSheet, View, Text, Dimensions, FlatList } from "react-native";
import axios from "../../../api/axios";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Room {
  _id: string;
  name: string;
  owner_id: string;
  max_capacity: number;
  description: string;
  equipments: string[];
  images: string[];
}

const ListRoom: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const roomsPerPage = 5;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get<{ rooms: Room[] }>("/rooms/all");
        setRooms(response.data.rooms);
      } catch (error) {
        console.log("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  const renderRoomRow = ({ item, index }: { item: any; index: number }) => {
    const startIndex = index * roomsPerPage;
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rowContainer}>
        {rooms.slice(startIndex, startIndex + roomsPerPage).map((room) => (
          <TouchableOpacity key={room._id} style={styles.roomContainer}>
            <Image
              source={{ uri: room.images[0] }}
              style={styles.image}
              onError={() => console.log("Image load error")}
            />
            <Text style={styles.name}>{room.name}</Text>
            <Text style={styles.owner}>Owner: {room.owner_id}</Text>
            <Text style={styles.capacity}>Capacité: {room.max_capacity} personnes</Text>
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
    width: 200,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
    padding: 10,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  owner: {
    opacity: 0.6,
    marginBottom: 5,
  },
  capacity: {
    marginBottom: 5,
    opacity:0.6
  },
  description: {
    marginBottom: 5,
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  }
});

export default ListRoom;
