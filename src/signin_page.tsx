import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { signIn, SignInInput } from "@aws-amplify/auth";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import LinearGradient from 'react-native-linear-gradient';

import { signOut } from 'aws-amplify/auth';

import { RootStackParamList } from "../App";
import Icon from 'react-native-vector-icons/Feather';


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
      Alert.alert("Log in Successful!");
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
      username: "tt17@gmail.com",
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
    <View style={styles.outer}>
  <View style={styles.card}>
    <Text style={styles.title}>Login</Text>

    <View style={styles.inputContainer}>
  <Icon name="mail" size={20} color="#888" style={styles.icon} />
  <TextInput
    style={styles.input}
    placeholder="Email"
    placeholderTextColor="#888"
    onChangeText={setEmail}
    value={email}
    selectionColor="#000"
    underlineColorAndroid="transparent"
  />
</View>

<View style={styles.inputContainer}>
  <Icon name="lock" size={20} color="#888" style={styles.icon} />
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
</View>

<TouchableOpacity onPress={handleSignin} activeOpacity={0.8} style={{ width: "90%" }}>
  <LinearGradient
     colors={["#12c2e9", "#c471ed", "#f64f59"]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
  style={styles.loginBtn}>
   <Text style={styles.loginBtnText}>Login</Text>
  </LinearGradient>
</TouchableOpacity>


<TouchableOpacity onPress={() => navigation.navigate("SignUp")} activeOpacity={0.8} style={{ width: "90%" }}>
  <LinearGradient
   colors={["#12c2e9", "#c471ed", "#f64f59"]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
  style={styles.loginBtn}>
    <Text style={styles.signupBtnText}>Sign Up</Text>
  </LinearGradient>
</TouchableOpacity>
  </View>
</View>

  );
};

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: "#0e89ec",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 12, // was 20
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20, // a little tighter spacing
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 6, // was 10, less rounded
    marginBottom: 16,
    backgroundColor: "#f8f8f8",
    fontSize: 16,
    color: "#000",
  },
  loginBtn: {
    paddingVertical: 14,
    borderRadius:4,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  loginBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  signupBtn: {
    paddingVertical: 14,
    borderRadius: 4,//same as login
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  signupBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  inputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 6,
  paddingHorizontal: 12,
  backgroundColor: '#f8f8f8',
  marginBottom: 16,
},
icon: {
  marginRight: 8,
},
});
 

export default LoginScreen;

