import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

const MyTest = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>Test Screen</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textStyle: {
    fontFamily: "mon-b",
    fontSize: 26,
  },
  button: {
    marginTop: 30,
    width: "50%",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  buttonText: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
  },
});

export default MyTest;
