import React from "react";
import { SafeAreaView } from "react-native";
import { Amplify } from "aws-amplify";
import awsExports from "./src/aws-exports"; // Ensure the file exists
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Import AsyncStorage


import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignUpScreen from "./src/signup_page";
import LoginScreen from "./src/signin_page"; // Import your login screen
import SearchScreen from "./src/search_page";
import CompanyInfoScreen from "./src/companyInfo"//React components must start with a capital letter, and so should their imports.

Amplify.configure({
  ...awsExports,
  storage: AsyncStorage,
});


// Define screen names and types
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  SearchScreen: undefined;
  CompanyInfo: {
    name: string;
    logo: string;
    domain: string;
  };
};

// Create the Stack Navigator
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="CompanyInfo" component={CompanyInfoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}