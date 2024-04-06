import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Reset = ({ navigation }) => {
  const [highestScore, setHighestScore] = useState(0);
  const [highFlag, setHighFlag] = useState(false);

  useEffect(() => {
    // Retrieve highest score from AsyncStorage on component mount
    retrieveHighestScore();
  }, []);

  const retrieveHighestScore = async () => {
    try {
      const storedScore = await AsyncStorage.getItem("highestScore");
      if (storedScore !== null) {
        setHighestScore(parseInt(storedScore));
      }
    } catch (error) {
      console.error("Error retrieving highest score:", error);
    }
  };

  const resetHighestScore = async () => {
    try {
      // Clear the highest score stored in AsyncStorage
      await AsyncStorage.removeItem("highestScore");
      // Update the state to reflect the reset
      setHighestScore(0);
      setHighFlag(true);

      //console.log("Rest OK");
    } catch (error) {
      console.error("Error resetting highest score:", error);
    }
  };

  {
    /*return <Button title="Reset Highest Score" onPress={resetHighestScore} />; */
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Initialize the Hight Score</Text>
      <Text style={styles.title}>The Hightest Score is : {highestScore}</Text>
      <TouchableOpacity style={styles.button} onPress={resetHighestScore}>
        <Text style={styles.buttonText}>Reset High Score</Text>
      </TouchableOpacity>

      {highFlag ? (
        <Text style={styles.subTitle}>High Score reset to 0</Text>
      ) : (
        <Text style={styles.subTitle}>Do you want to reset?</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Play again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
    marginTop: 100,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    width: "50%",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderWidth: 2,
    borderColor: "blue",
    borderRadius: 10,
    backgroundColor: "blue",
    //marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
});
export default Reset;
