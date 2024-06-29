import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Layout, Button, Datepicker } from "@ui-kitten/components";
import Toast from "react-native-toast-message";
import axios from "../../api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  _id: string;
}

const ReservationModalScreen: React.FC = ({ route }: any) => {
  const [reservationDateTime, setReservationDateTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [utilisateur, setUser] = useState<User | null>(null);

  const { roomId } = route.params;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const userInfo: User = JSON.parse(userData);
          setUser(userInfo);
        } else {
          console.log("User data not found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error fetching user: ", error);
      }
    };

    fetchUser();
  }, []);

  const showToast = (type: any, text1: any, text2: any) => {
    Toast.show({
      type: type,
      position: "top",
      text1: text1,
      text2: text2,
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });
  };

  const handleReservation = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/reservations", {
        room_id: roomId,
        user_id: utilisateur?._id,
        date_debut: reservationDateTime,
        end_date: endTime,
        reservation_status: "pending",
      });

      showToast("success", "Succès", response.data.message + " 👋");
      if (response.data.erreur) {
        showToast("error", "Erreur", response.data.erreur);
      }
      setReservationDateTime(new Date());
      setEndTime(new Date());
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        showToast("error", "Erreur", error.response.data.message);
      } else {
        showToast(
          "error",
          "Erreur",
          "Une erreur s'est produite. Veuillez réessayer plus tard."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <Layout style={styles.container}>
          <Datepicker
            style={styles.input}
            label="Date Début"
            date={reservationDateTime}
            onSelect={setReservationDateTime}
          />

          <Datepicker
            style={styles.input}
            label="Date fin"
            date={endTime}
            onSelect={setEndTime}
          />

          <Button
            style={styles.button}
            onPress={handleReservation}
            disabled={loading}
          >
            {loading ? "Envoyer..." : "Envoyer"}
          </Button>
        </Layout>
      </SafeAreaView>
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginVertical: 8,
  },
  button: {
    marginTop: 16,
  },
});

export default ReservationModalScreen;
