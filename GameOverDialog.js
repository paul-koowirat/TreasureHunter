import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const GameOverDialog = ({ onRestart, onExit }) => {
  return (
    <View style={styles.container}>
      <View style={styles.dialog}>
        <Text style={styles.title}>You're destroyed !!</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={onRestart}>
            <Text style={styles.buttonText}>Continue playing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onExit}>
            <Text style={styles.buttonText}>Exit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
    //top: 10,
    //left: 30,
  },
  dialog: {
    backgroundColor: "white",
    padding: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  buttonsContainer: {
    //flexDirection: "row",
    //justifyContent: "space-between",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: 20,
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    backgroundColor: "blue",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
});

export default GameOverDialog;
