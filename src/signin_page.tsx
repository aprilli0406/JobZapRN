import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { signIn, SignInInput } from "@aws-amplify/auth";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { signOut } from 'aws-amplify/auth';

import { RootStackParamList } from "../App";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignin() {
    
    try {
      
      await signOut({ global: true });//log out before sign in 
      
      const { isSignedIn, nextStep } = await signIn({ 
          username: email,
          password: password,
          // this is required to login using username and password 
          options: {
              authFlowType: 'USER_PASSWORD_AUTH'
          }
      });
      Alert.alert("Log In Successfully!");
      console.log('isSignedIn', isSignedIn);
      console.log('nextStep', nextStep);

      if (isSignedIn && nextStep.signInStep === 'DONE') {
        
        navigation.navigate("SearchScreen");
      } else {
        Alert.alert("Login Info", `Next step: ${nextStep.signInStep}`);
      }
  } catch (error: any) {
    console.log("Error signing in:", error);
  
    const title = error?.name || "Login Failed";
    const message = error?.message || error?.underlyingError?.message || "Something went wrong.";
  
    Alert.alert(title, message);
  }
  
}
//test login 
async function handleTestLogin() {
  try {
    await signOut({ global: true }); // Make sure user is signed out

    const { isSignedIn, nextStep } = await signIn({
      username: "tt09@gmail.com",
      password: "Lyy2345@",
      options: {
        authFlowType: "USER_PASSWORD_AUTH"
      }
    });

    Alert.alert("Test Login Successful!");
    console.log('isSignedIn', isSignedIn);
    console.log('nextStep', nextStep);

    if (isSignedIn && nextStep.signInStep === "DONE") {
      navigation.navigate("SearchScreen");
    } else {
      Alert.alert("Login Info", `Next step: ${nextStep.signInStep}`);
    }

  } catch (error: any) {
    console.log("Error signing in:", error);
  
    const title = error?.name || "Login Failed";
    const message = error?.message || error?.underlyingError?.message || "Something went wrong.";
  
    Alert.alert(title, message);
  }
}




  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* ✅ Input Fields */}
      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} />

    {/* Login Button */}
    <Button title="Login" onPress={handleSignin} />

    {/* Test Login Button */}
    <Button title="Test Login" onPress={handleTestLogin} />

    {/* Sign-Up Button  */}
      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

// ✅ Improved Styling for Correct Button Placement
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { width: "100%", borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  signupText: { textAlign: "center", marginTop: 15, color: "blue", fontSize: 16, fontWeight: "bold" },
});

export default LoginScreen;

