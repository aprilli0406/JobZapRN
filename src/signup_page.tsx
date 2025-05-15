import { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { signUp, signIn } from "@aws-amplify/auth";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack"; // ✅ Import this!
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';


type RootStackParamList = {
    Login: undefined;
    SignUp: undefined;
    SearchScreen: undefined;
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
              email: email,
              given_name: firstName,
              family_name: lastName,
              
            },
          },
        });
        Alert.alert("Success", "Account created! ");
         // 2. Immediately sign in the user
        

        Alert.alert("Auto logged in~");
        
        navigation.navigate("SearchScreen"); // ✅ Redirect to Login Screen

      } catch (error: unknown) {
        Alert.alert("sign up failed!!!");
        console.error("Signup error:", error);
      }
      finally {
        setLoading(false);
      }
    };
  
    return (
      <View style={styles.outer}>
  <View style={styles.card}>
    <Text style={styles.title}>Sign Up</Text>

    <TextInput
  style={styles.input}
  placeholder="First Name"
  placeholderTextColor="#888" // light gray label
  onChangeText={setFirstName}
  value={firstName}
  selectionColor="#000"
  underlineColorAndroid="transparent"
/>

<TextInput
  style={styles.input}
  placeholder="Last Name"
  placeholderTextColor="#888"
  onChangeText={setLastName}
  value={lastName}
  selectionColor="#000"
  underlineColorAndroid="transparent"
/>

<TextInput
  style={styles.input}
  placeholder="Email"
  placeholderTextColor="#888"
  onChangeText={setEmail}
  value={email}
  selectionColor="#000"
  underlineColorAndroid="transparent"
/>

<TextInput
  style={styles.input}
  placeholder="Password"
  placeholderTextColor="#888"
  secureTextEntry
  onChangeText={setPassword}
  value={password}
  selectionColor="#000"
  underlineColorAndroid="transparent"
/>

<TextInput
  style={styles.input}
  placeholder="Confirm Password"
  placeholderTextColor="#888"
  secureTextEntry
  onChangeText={setConfirmPassword}
  value={confirmPassword}
  selectionColor="#000"
  underlineColorAndroid="transparent"
/>
    <TouchableOpacity
  onPress={() => navigation.navigate("SignUp")}
  activeOpacity={0.8}
  style={styles.loginBtnSolid}
>
  <Text style={styles.loginBtnText}>Sign Up</Text>
</TouchableOpacity>

  </View>
</View>

    );
  };
  
  const styles = StyleSheet.create({
    outer: {
      flex: 1,
      backgroundColor: "#007aff",
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      backgroundColor: "#fff",
      padding: 30,
      borderRadius: 20,
      width: "85%",
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 25,
    },
    input: {
      width: "100%",
      borderWidth: 1,
      borderColor: "#ddd",
      padding: 12,
      borderRadius: 10,
      marginBottom: 15,
      backgroundColor: "#f5f5f5",
      fontSize: 16,
      color: "#000", 
    },
    signupBtn: {
      padding: 12,
      borderRadius: 20,
      alignItems: "center",
      alignSelf: "center",
      marginTop: 10,
    },
    signupBtnText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
    loginBtn: {
  width: "100%",
  paddingVertical: 14,
  borderRadius: 4,
  alignItems: "center",
  marginTop: 10,
},
loginBtnText: {
  color: "white",
  fontWeight: "bold",
  fontSize: 16,
},
loginBtnSolid: {
  backgroundColor: '#0059a9',
  paddingVertical: 14,
  borderRadius: 4,
  alignItems: 'center',
  width: '95%',
  marginTop: 12,
},

  });
  
 
  export default SignUpScreen;