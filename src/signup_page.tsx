import { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { signUp } from "@aws-amplify/auth";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack"; // ✅ Import this!
import AsyncStorage from '@react-native-async-storage/async-storage';


type RootStackParamList = {
    Login: undefined;
    SignUp: undefined;
  };
  
  type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, "SignUp">;
  
  const SignUpScreen = () => {
    const navigation = useNavigation<SignUpScreenNavigationProp>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [loading, setLoading] = useState(false);
  
    const handleSignUp = async () => {
      if (!email || !password || !confirmPassword || !firstName || !lastName) {
        Alert.alert("Error", "All fields are required!");
        return;
      }
  
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match!");
        return;
      }
  
      setLoading(true);
  
      try {
        await signUp({
          username: email,
          password,
          options: {
            userAttributes: {
              email,
              given_name: firstName,
              family_name: lastName,
            },
          },
        });
  
        Alert.alert("Success", "Account created! Please log in.");
        navigation.navigate("Login"); // ✅ Redirect to Login Screen
      } catch (error: unknown) {
        if (error instanceof Error) {
          Alert.alert("Signup Failed", error.message);
        } else {
          Alert.alert("Signup Failed", "An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
  
        <TextInput placeholder="First Name" style={styles.input} onChangeText={setFirstName} />
        <TextInput placeholder="Last Name" style={styles.input} onChangeText={setLastName} />
        <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} />
        <TextInput placeholder="Password" style={styles.input} secureTextEntry onChangeText={setPassword} />
        <TextInput placeholder="Confirm Password" style={styles.input} secureTextEntry onChangeText={setConfirmPassword} />
  
        <Button title={loading ? "Signing Up..." : "Sign Up"} onPress={handleSignUp} disabled={loading} />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  });
  
  export default SignUpScreen;