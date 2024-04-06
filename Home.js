import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";

import React from "react";
import { useFonts } from "expo-font";

const Home = ({ navigation }) => {
  //const Stack = createNativeStackNavigator();
  return (
    <ImageBackground
      style={styles.background}
      resizeMode="cover"
      source={require("./assets/background.jpg")}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Treasure Hunter</Text>
        {/*<Text style={styles.subTitle}>Under Sea Adventure</Text>*/}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MyGame")}
        >
          <Text style={styles.buttonText}>Start Game</Text>
        </TouchableOpacity>

        <Image
          source={require("./assets/divertitle.png")}
          style={styles.image}
        />
      </View>
    </ImageBackground>
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
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    marginTop: 100,
  },
  subTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    width: "100%",
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
  image: {
    width: 200,
    height: 200,
    top: 280,
    left: 30,
  },
});

export default Home;
