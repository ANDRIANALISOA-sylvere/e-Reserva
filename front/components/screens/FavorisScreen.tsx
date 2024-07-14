import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import { Button } from "@ui-kitten/components";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "../../api/axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Favori {
  _id: string;
  room_id: {
    _id: string;
    name: string;
    max_capacity: number;
    price: number;
    images: string[];
  };
  favoris: boolean;
}

const FavorisScreen = ({ navigation }: any) => {
  const [favoris, setFavoris] = useState<Favori[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          setUserId(user._id);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'ID utilisateur:",
          error
        );
      }
    };

    getUserId();
  }, []);

  const fetchFavoris = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`/list/${userId}`);
      setFavoris(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des favoris:", error);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchFavoris();
    }
  }, [userId, fetchFavoris]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFavoris().then(() => setRefreshing(false));
  }, [fetchFavoris]);

  const toggleFavorite = async (favoriId: string, roomId: string) => {
    if (!userId) return;
    try {
      await axios.post("/update", {
        userId: userId,
        roomId: roomId,
        isFavoris: false,
      });
      setFavoris(favoris.filter((favori) => favori._id !== favoriId));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du favori:", error);
    }
  };

  const renderItem = ({ item }: { item: Favori }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.room_id.images[0] }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.room_id.name}</Text>
        <Text style={styles.capacity}>
          Capacité: {item.room_id.max_capacity}
        </Text>
        <Text style={styles.price}>Prix: {item.room_id.price} Ar</Text>
        <Button
          size="filled"
          style={styles.detailsButton}
          onPress={() =>
            navigation.navigate("Salle", { roomId: item.room_id._id })
          }
        >
          Voir détails
        </Button>
      </View>
      <Pressable
        style={styles.heartIcon}
        onPress={() => toggleFavorite(item._id, item.room_id._id)}
      >
        <Ionicons name="heart" size={24} color="red" />
      </Pressable>
    </View>
  );

  if (!userId) {
    return <Text>Chargement...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favoris}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    gap: 5,
  },
  image: {
    width: 100,
    height: "100%",
    borderRadius: 8,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  name: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    marginBottom: 4,
  },
  capacity: {
    fontFamily: "Poppins",
    fontSize: 14,
    opacity: 0.4,
    marginBottom: 2,
  },
  price: {
    fontFamily: "Poppins",
    fontSize: 14,
    opacity: 0.4,
    marginBottom: 4,
  },
  detailsButton: {
    alignSelf: "flex-start",
  },
  heartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default FavorisScreen;
