import React, { useEffect, useState } from "react";
import { View, Image, ScrollView } from "react-native";
import { Button, Input, Text, Layout } from "@ui-kitten/components";
import * as ImagePicker from "expo-image-picker";
import axios from "../../api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    <ScrollView>
      <Layout style={{ flex: 1, padding: 16 }}>
        <Text category="h1">Nouvelle salle pour un spectacle</Text>

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

        <Button onPress={pickImage} style={{ marginVertical: 8 }}>
          Ajouter des images
        </Button>

        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={{ width: 100, height: 100, margin: 5 }}
            />
          ))}
        </View>

        <Button onPress={handleSubmit} style={{ marginVertical: 16 }}>
          Ajouter la salle
        </Button>
      </Layout>
    </ScrollView>
  );
};

export default AddRoom;
