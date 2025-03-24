import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotCredentials: undefined;
};

type ForgotCredentialsScreenNavigationProp = StackNavigationProp<RootStackParamList, "ForgotCredentials">;

const ForgotCredentialsScreen = () => {
  const navigation = useNavigation<ForgotCredentialsScreenNavigationProp>();
  const [option, setOption] = useState<"username" | "password" | null>(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = () => {
    if (option === "username" && !email) {
      Alert.alert("❌ Error", "Please enter your email.");
      return;
    }
    if (option === "password" && (!email || !username)) {
      Alert.alert("❌ Error", "Please enter your username and email.");
      return;
    }

    Alert.alert("📧 Success", `Recovery details sent to ${email}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Username/Password</Text>

      {/*Option selection */}
      <TouchableOpacity style={styles.optionButton} onPress={() => setOption("username")}>
        <Text style={styles.optionText}>Forgot Username</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={() => setOption("password")}>
        <Text style={styles.optionText}>Forgot Password</Text>
      </TouchableOpacity>

      {/*Input fields */}
      {option === "username" && (
        <TextInput placeholder="Enter your email" style={styles.input} onChangeText={setEmail} />
      )}

      {option === "password" && (
        <>
          <TextInput placeholder="Enter your username" style={styles.input} onChangeText={setUsername} />
          <TextInput placeholder="Enter your email" style={styles.input} onChangeText={setEmail} />
        </>
      )}

      {/*Submit button */}
      {option && <Button title="Submit" onPress={handleSubmit} />}

      {/* Go back button */}
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  optionButton: { backgroundColor: "#3498db", padding: 10, marginBottom: 10, borderRadius: 5, width: "100%" },
  optionText: { color: "#fff", fontSize: 16, textAlign: "center" },
  input: { width: "100%", borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  backText: { textAlign: "center", marginTop: 10, color: "red", fontSize: 16, fontWeight: "bold" },
});

export default ForgotCredentialsScreen;
