import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { signIn } from "@aws-amplify/auth";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Define Navigation Type
type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signIn({ username: email, password });
      Alert.alert("✅ Success", "Login successful!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("❌ Login Failed", error.message);
      } else {
        Alert.alert("❌ Login Failed", "An unknown error occurred");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* ✅ Input Fields */}
      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} />

      {/* ✅ Login Button */}
      <Button title="Login" onPress={handleLogin} />

      {/* ✅ Sign-Up Button (Correctly Positioned) */}
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
