import React from "react";
import { SafeAreaView, StyleSheet, View, Image } from "react-native";
import { Layout, Text, Icon } from "@ui-kitten/components";

const ReservationDetailScreen: React.FC = ({ route }: any) => {
  const { reservation } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Layout style={styles.detailContainer}>
        <Image
          source={{ uri: reservation.room_id.images[0] }}
          style={styles.image}
        />
        <Text category="s1">
          Date de début: {new Date(reservation.date_debut).toLocaleDateString()}
        </Text>
        <Text category="s1">
          Date de fin: {new Date(reservation.end_date).toLocaleDateString()}
        </Text>
        <Text category="s1">Status: {reservation.reservation_status}</Text>
        <Text category="s1">Prix: {reservation.room_id.price}</Text>
        <Text category="c1">
          Créé le: {new Date(reservation.createdAt).toLocaleDateString()}
        </Text>
        <Text category="c1">
          Mis à jour le: {new Date(reservation.updatedAt).toLocaleDateString()}
        </Text>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  detailContainer: {
    padding: 16,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
});

export default ReservationDetailScreen;
