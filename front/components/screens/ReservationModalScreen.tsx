import React, { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Layout, Input, Button, Text, Datepicker } from "@ui-kitten/components";
import axios from "axios";

const ReservationModalScreen = () => {
  const [reservationDateTime, setReservationDateTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const userId = "66755fe10eeb4233046495a3";
  const id = "6677e85cb72a594401bb2c93";

  const handleReservation = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://192.168.43.149:5000/api/reservations",
        {
          room_id: id,
          user_id: userId,
          date_debut: reservationDateTime,
          end_date: endTime,
          reservation_status: "pending",
        }
      );

      setMessage(response.data.message);
      setReservationDateTime(new Date());
      setEndTime(new Date());
    } catch (error: any) {
      console.error(error);
      setMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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

        {message && <Text style={styles.message}>{message}</Text>}
      </Layout>
    </SafeAreaView>
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
  message: {
    marginTop: 16,
    textAlign: "center",
  },
});

export default ReservationModalScreen;
