import React, { useState } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { Button, Input, Text, Layout } from '@ui-kitten/components';
import * as ImagePicker from 'expo-image-picker';
import axios from '../../api/axios';

interface RoomData {
  name: string;
  owner_id: string;
  max_capacity: number;
  price: number;
  description: string;
  equipments: string;
}

const AddRoom: React.FC = () => {
  const [roomData, setRoomData] = useState<RoomData>({
    name: '',
    owner_id: '668ad6676abe4ede21640a5a',
    max_capacity: 0,
    price: 0,
    description: '',
    equipments: '',
  });
  const [images, setImages] = useState<string[]>([]);

  const handleInputChange = (name: keyof RoomData, value: string | number) => {
    setRoomData({ ...roomData, [name]: value });
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
      Object.keys(roomData).forEach((key) => {
        formData.append(key, roomData[key as keyof RoomData].toString());
      });

      images.forEach((image, index) => {
        const imageUri = image;
        const uriParts = imageUri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        formData.append('images', {
          uri: imageUri,
          name: `image_${index}.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      });

      console.log('FormData content:', Object.fromEntries(formData));

      const response = await axios.post('/rooms', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
        transformRequest: (data, headers) => {
          return formData;
        },
      });

      console.log('Response:', response.data);
      alert('Salle ajoutée avec succès !');
      setRoomData({
        name: '',
        owner_id: '668ad6676abe4ede21640a5a',
        max_capacity: 0,
        price: 0,
        description: '',
        equipments: '',
      });
      setImages([]);
    } catch (error) {
      console.error('Error adding room:', error);
      alert('Une erreur est survenue lors de l\'ajout de la salle.');
    }
  };

  return (
    <ScrollView>
      <Layout style={{ flex: 1, padding: 16 }}>
        <Text category='h1'>Nouvelle salle pour un spectacle</Text>
        
        <Input
          placeholder='Nom de la salle'
          value={roomData.name}
          onChangeText={(value) => handleInputChange('name', value)}
          style={{ marginVertical: 8 }}
        />
        <Input
          placeholder='Capacité maximale'
          value={roomData.max_capacity.toString()}
          onChangeText={(value) => handleInputChange('max_capacity', parseInt(value))}
          keyboardType='numeric'
          style={{ marginVertical: 8 }}
        />
        <Input
          placeholder='Prix'
          value={roomData.price.toString()}
          onChangeText={(value) => handleInputChange('price', parseFloat(value))}
          keyboardType='numeric'
          style={{ marginVertical: 8 }}
        />
        <Input
          placeholder='Description'
          value={roomData.description}
          onChangeText={(value) => handleInputChange('description', value)}
          multiline
          textStyle={{ minHeight: 64 }}
          style={{ marginVertical: 8 }}
        />
        <Input
          placeholder='Équipements (séparés par des virgules)'
          value={roomData.equipments}
          onChangeText={(value) => handleInputChange('equipments', value)}
          style={{ marginVertical: 8 }}
        />
        
        <Button onPress={pickImage} style={{ marginVertical: 8 }}>Ajouter des images</Button>
        
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={{ width: 100, height: 100, margin: 5 }} />
          ))}
        </View>
        
        <Button onPress={handleSubmit} style={{ marginVertical: 16 }}>Ajouter la salle</Button>
      </Layout>
    </ScrollView>
  );
};

export default AddRoom;