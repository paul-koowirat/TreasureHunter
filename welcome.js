import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./Home";
import MyGame from "./MyGame";
import ExitDialog from "./ExitDialog";
import Reset from "./ResetDialog";
//import MyTest from "./MyTest";

const Stack = createNativeStackNavigator();

const Welcome = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="MyGame"
          component={MyGame}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Exit"
          component={ExitDialog}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Reset"
          component={Reset}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Welcome;
