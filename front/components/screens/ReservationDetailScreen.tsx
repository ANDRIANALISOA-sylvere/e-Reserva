import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { Layout, Text } from "@ui-kitten/components";
import Swiper from "react-native-swiper";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const { width: viewportWidth } = Dimensions.get("window");

const ReservationDetailScreen: React.FC = ({ route }: any) => {
  const { reservation } = route.params;

  const renderStatusBadge = (status: string) => {
    let color;
    switch (status) {
      case "pending":
        color = "#FFA500";
        break;
      case "confirmed":
        color = "#008000";
        break;
      case "cancelled":
        color = "#FF0000";
        break;
      default:
        color = "#808080";
    }
    return (
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>{status}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Layout style={styles.detailContainer}>
          <View style={styles.imageContainer}>
            {reservation.room_id.images.length > 1 ? (
              <Swiper
                style={styles.wrapper}
                showsButtons={true}
                nextButton={<Text style={styles.buttonText}>›</Text>}
                prevButton={<Text style={styles.buttonText}>‹</Text>}
              >
                {reservation.room_id.images.map(
                  (image: string, index: number) => (
                    <Image
                      key={index}
                      source={{ uri: image }}
                      style={styles.image}
                    />
                  )
                )}
              </Swiper>
            ) : (
              <Image
                source={{ uri: reservation.room_id.images[0] }}
                style={styles.image}
              />
            )}
          </View>
          <Text category="h5" style={styles.title}>
            {reservation.room_id.name}
          </Text>
          <Text category="s1" style={styles.infoText}>
            <FontAwesome name="calendar" size={16} /> Date de début:{" "}
            {new Date(reservation.date_debut).toLocaleDateString()}
          </Text>
          <Text category="s1" style={styles.infoText}>
            <FontAwesome name="calendar" size={16} /> Date de fin:{" "}
            {new Date(reservation.end_date).toLocaleDateString()}
          </Text>
          <Text category="s1" style={styles.infoText}>
            <FontAwesome name="info-circle" size={16} /> Status:{" "}
            {renderStatusBadge(reservation.reservation_status)}
          </Text>
          <Text category="s1" style={styles.infoText}>
            <FontAwesome name="money" size={16} /> Prix:{" "}
            {reservation.room_id.price} Ar
          </Text>
          <Text category="c1" style={styles.infoText}>
            <FontAwesome name="clock-o" size={16} /> Créé le:{" "}
            {new Date(reservation.createdAt).toLocaleDateString()}
          </Text>
          <Text category="c1" style={styles.infoText}>
            <FontAwesome name="clock-o" size={16} /> Mis à jour le:{" "}
            {new Date(reservation.updatedAt).toLocaleDateString()}
          </Text>
          <Text category="h6" style={styles.sectionTitle}>
            Description
          </Text>
          <Text category="p1" style={styles.description}>
            {reservation.room_id.description}
          </Text>
          <Text category="h6" style={styles.sectionTitle}>
            Équipements
          </Text>
          <View style={styles.equipmentsContainer}>
            {reservation.room_id.equipments.map(
              (equipment: string, index: number) => (
                <View key={index} style={styles.badge}>
                  <Text style={styles.badgeText}>{equipment}</Text>
                </View>
              )
            )}
          </View>
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 10,
  },
  detailContainer: {
    padding: 15,
  },
  imageContainer: {
    height: 250,
    marginBottom: 16,
  },
  wrapper: {
    height: 250,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 50,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "justify",
    color: "#666",
  },
  equipmentsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  badge: {
    backgroundColor: "#333",
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
});

export default ReservationDetailScreen;
