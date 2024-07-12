import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Button, Input, Text, Layout } from "@ui-kitten/components";
import * as ImagePicker from "expo-image-picker";
import axios from "../../api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

interface RoomData {
  name: string;
  owner_id: string;
  max_capacity: string;
  price: string;
  description: string;
  equipments: string;
}

const AddRoom: React.FC = () => {
  const [roomData, setRoomData] = useState<RoomData>({
    name: "",
    owner_id: "",
    max_capacity: "",
    price: "",
    description: "",
    equipments: "",
  });
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          setRoomData((prevData) => ({ ...prevData, owner_id: user._id }));
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'ID utilisateur:",
          error
        );
      }
    };

    fetchUserId();
  }, []);

  const handleInputChange = (name: keyof RoomData, value: string | number) => {
    if (name === "max_capacity" || name === "price") {
      setRoomData({ ...roomData, [name]: value.toString() });
    } else {
      setRoomData({ ...roomData, [name]: value });
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("name", roomData.name);
      formData.append("owner_id", roomData.owner_id);
      formData.append("max_capacity", roomData.max_capacity.toString());
      formData.append("price", roomData.price.toString());
      formData.append("description", roomData.description);
      formData.append("equipments", roomData.equipments);

      images.forEach((image, index) => {
        const imageUri = image;
        const uriParts = imageUri.split(".");
        const fileType = uriParts[uriParts.length - 1];

        formData.append("images", {
          uri: imageUri,
          name: `image_${index}.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      });

      console.log("FormData content:", formData);

      const response = await axios.post("/rooms", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);
      alert("Salle ajoutée avec succès !");
      setRoomData({
        name: "",
        owner_id: "",
        max_capacity: "",
        price: "",
        description: "",
        equipments: "",
      });
      setImages([]);
    } catch (error) {
      console.error("Error adding room:", error);
      alert("Une erreur est survenue lors de l'ajout de la salle.");
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <View style={{ flex: 1, padding: 16 }}>
        <Input
          placeholder="Nom de la salle"
          value={roomData.name}
          onChangeText={(value) => handleInputChange("name", value)}
          style={{ marginVertical: 8 }}
        />
        <Input
          placeholder="Capacité maximale"
          value={roomData.max_capacity}
          onChangeText={(value) => handleInputChange("max_capacity", value)}
          keyboardType="numeric"
          style={{ marginVertical: 8 }}
        />
        <Input
          placeholder="Prix"
          value={roomData.price}
          onChangeText={(value) => handleInputChange("price", value)}
          keyboardType="numeric"
          style={{ marginVertical: 8 }}
        />
        <Input
          placeholder="Description"
          value={roomData.description}
          onChangeText={(value) => handleInputChange("description", value)}
          multiline
          textStyle={{ minHeight: 64 }}
          style={{ marginVertical: 8 }}
        />
        <Input
          placeholder="Équipements (séparés par des virgules)"
          value={roomData.equipments}
          onChangeText={(value) => handleInputChange("equipments", value)}
          style={{ marginVertical: 8 }}
        />

        <TouchableOpacity
          onPress={pickImage}
          style={styles.imagePickerContainer}
        >
          {images.length === 0 ? (
            <>
              <Icon name="cloud-upload" size={40} color="#888" />
              <Text style={styles.imagePickerText}>
                Choisir des fichiers images
              </Text>
            </>
          ) : (
            <View style={styles.imageGrid}>
              {images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.thumbnailImage}
                />
              ))}
            </View>
          )}
        </TouchableOpacity>

        <Button onPress={handleSubmit} style={{ marginVertical: 16 }}>
          Ajouter la salle
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  imagePickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 4,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    minHeight: 150,
  },
  imagePickerText: {
    color: "#888",
    marginTop: 10,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    fontFamily: "Poppins",
  },
  thumbnailImage: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 4,
  },
});

export default AddRoom;
