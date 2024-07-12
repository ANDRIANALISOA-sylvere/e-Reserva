import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  ScrollView,
  Dimensions,
  Pressable,
} from "react-native";
import { Layout, Text, Divider, Button } from "@ui-kitten/components";
import Swiper from "react-native-swiper";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Material from "react-native-vector-icons/MaterialIcons";

const ReservationDetailScreen: React.FC = ({ route }: any) => {
  const { reservation } = route.params;

  const renderStatusBadge = (status: string) => {
    let backgroundColor, textColor, displayText;
    switch (status) {
      case "pending":
        backgroundColor = "#FFF3E0";
        textColor = "#FF9800";
        displayText = "En attente";
        break;
      case "confirmed":
        backgroundColor = "#E8F5E9";
        textColor = "#4CAF50";
        displayText = "Confirmée";
        break;
      case "cancelled":
        backgroundColor = "#FFEBEE";
        textColor = "#F44336";
        displayText = "Annulée";
        break;
      default:
        backgroundColor = "#F5F5F5";
        textColor = "#9E9E9E";
        displayText = "Inconnu";
    }
    return (
      <View style={[styles.statusBadge, { backgroundColor }]}>
        <Text style={[styles.statusBadgeText, { color: textColor }]}>
          {displayText}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        {reservation.room_id.images.length > 1 ? (
          <Swiper
            style={styles.wrapper}
            showsButtons={true}
            nextButton={<Text style={styles.buttonText}>›</Text>}
            prevButton={<Text style={styles.buttonText}>‹</Text>}
          >
            {reservation.room_id.images.map((image: string, index: number) => (
              <Image key={index} source={{ uri: image }} style={styles.image} />
            ))}
          </Swiper>
        ) : (
          <Image
            source={{ uri: reservation.room_id.images[0] }}
            style={styles.image}
          />
        )}
        <Pressable style={styles.favIcon}>
          <Ionicons name="heart-outline" size={20} color="#fff" />
        </Pressable>
        <Text style={styles.name}>{reservation.room_id.name}</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Material name="event" size={24} color="#666" />
            <Text style={styles.infoText}>
              {new Date(reservation.date_debut).toLocaleDateString()} -{" "}
              {new Date(reservation.end_date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome name="info-circle" size={20} color="#666" />
            {renderStatusBadge(reservation.reservation_status)}
          </View>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>
            {reservation.room_id.price} Ar / heure
          </Text>
        </View>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {reservation.room_id.description}
        </Text>
        <Text style={styles.sectionTitle}>Équipements</Text>
        <View style={styles.equipmentsContainer}>
          {reservation.room_id.equipments.map(
            (equipment: string, index: number) => (
              <View key={index} style={styles.equipmentBadge}>
                <Text style={styles.equipmentText}>{equipment}</Text>
              </View>
            )
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  contentContainer: {
    padding: 10,
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
    opacity: 0.7,
    fontFamily: "Poppins",
  },
  equipmentsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
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
  modifyButton: {
    marginTop: 20,
    margin: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontFamily: "Poppins-Bold",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginLeft: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
  },
});

export default ReservationDetailScreen;
