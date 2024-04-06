import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  //AsyncStorage,
} from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const ExitDialog = ({ navigation, route }) => {
  const { totalScore } = route.params;
  const [highestScore, setHighestScore] = useState(null);
  const [previousHighestScore, setPreviousHighestScore] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const updateHighestScore = async () => {
      try {
        const storedScore = await AsyncStorage.getItem("highestScore");
        const currentHighestScore = parseInt(storedScore) || 0;

        if (totalScore > currentHighestScore) {
          await AsyncStorage.setItem("highestScore", totalScore.toString());
          setMessage("You are the new highest score!");
          setHighestScore(totalScore);
          setPreviousHighestScore(currentHighestScore);
        } else {
          setMessage("Sorry, try again!");
          setHighestScore(currentHighestScore);
          setPreviousHighestScore(currentHighestScore);
        }
      } catch (error) {
        console.error("Error updating highest score:", error);
      }
    };

    updateHighestScore();
  }, [totalScore]);

  const handleExit = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Score: {totalScore}</Text>
      <Text style={styles.subTitle}>
        The Highest Score:{" "}
        {previousHighestScore !== null ? previousHighestScore : "N/A"}
      </Text>
      <Text style={styles.subTitle}>{message}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Continue Playing</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Reset")}
      >
        <Text style={styles.buttonText}>Reset High Score</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
    marginTop: 10,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
    marginTop: 10,
  },
  button: {
    marginTop: 40,
    width: "50%",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderWidth: 2,
    borderColor: "blue",
    borderRadius: 10,
    backgroundColor: "blue",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
});

export default ExitDialog;
