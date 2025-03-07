import React from "react";
import { SafeAreaView } from "react-native";
import { Amplify } from "aws-amplify";
import awsExports from "./src/aws-exports"; // Ensure the file exists
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Import AsyncStorage


import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import SignUpScreen from "./src/signup_page";
import LoginScreen from "./src/signin_page"; // Import your login screen


Amplify.configure({
  ...awsExports,
  storage: AsyncStorage,
});


// ✅ Define screen names and types
type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

// ✅ Create the Stack Navigator
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}