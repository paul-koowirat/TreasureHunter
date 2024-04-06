import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";
import * as Splashscreen from "expo-splash-screen";
import { useCallback } from "react";

import Welcome from "./welcome";

export default function App() {
  const [fontsLoaded] = useFonts({
    mon: require("./assets/fonts/Montserrat-Regular.ttf"),
    "mon-sb": require("./assets/fonts/Montserrat-SemiBold.ttf"),
    "mon-b": require("./assets/fonts/Montserrat-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await Splashscreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  // call welcome screen
  return <Welcome />;
}
