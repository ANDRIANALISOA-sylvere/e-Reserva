import React, { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  Image,
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
} from "react-native";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const roomsPerPage = 5;
  const flatListRef = useRef<FlatList>(null);


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


  const handleScroll = (event: any) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const pageHeight = Dimensions.get("window").height;
    const newIndex = Math.round(contentOffsetY / pageHeight);
    setCurrentIndex(newIndex);
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
          <TouchableOpacity key={room._id} style={styles.roomContainer}>
            <Image
              source={{ uri: room.images[0] }}
              style={styles.image}
              onError={() => console.log("Image load error")}
            />
            <Text style={styles.name}>{room.name}</Text>
            <Text style={styles.owner}>Owner: {room.owner_id}</Text>
            <Text style={styles.capacity}>Capacity: {room.max_capacity}</Text>
            <Text style={styles.description}>
              {room.description.substring(0, 50)}...
            </Text>
            <BadgeContainer equipments={room.equipments} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      data={Array(Math.ceil(rooms.length / roomsPerPage)).fill(0)}
      renderItem={renderRoomRow}
      keyExtractor={(_, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      snapToInterval={Dimensions.get("window").height}
      snapToAlignment="start"
      decelerationRate="fast"
    />
  );
};

interface BadgeContainerProps {
  equipments: string[];
}

const BadgeContainer: React.FC<BadgeContainerProps> = ({ equipments }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.badgeContainer}
    >
      {equipments.map((equipment, index) => (
        <View key={index} style={styles.badge}>
          <Text>{equipment}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    marginBottom: 20,
    height: Dimensions.get("window").height - 100,
  },
  roomContainer: {
    width: 200,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
  },
  image: {
    width: "100%",
    height: 200,
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
  },
  description: {
    marginBottom: 5,
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  badge: {
    margin: 2,
  },
});

export default ListRoom;
