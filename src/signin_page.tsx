import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { signIn, SignInInput } from "@aws-amplify/auth";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import LinearGradient from 'react-native-linear-gradient';

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
    <View style={styles.outer}>
  <View style={styles.card}>
    <Text style={styles.title}>Login</Text>

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



<TouchableOpacity onPress={handleSignin} activeOpacity={0.8} style={{ width: "90%" }}>
  <LinearGradient
    colors={["#dc2424", "#4a569d"]}
    style={styles.loginBtn} >
    <Text style={styles.loginBtnText}>LOGIN</Text>
  </LinearGradient>
</TouchableOpacity>


<TouchableOpacity onPress={() => navigation.navigate("SignUp")} activeOpacity={0.8} style={{ width: "90%" }}>
  <LinearGradient
    colors={["#24c6dc", "#514a9d"]}
    style={styles.signupBtn}
  >
    <Text style={styles.signupBtnText}>Sign Up</Text>
  </LinearGradient>
</TouchableOpacity>



<TouchableOpacity onPress={handleTestLogin} style={styles.testBtn}>
      <Text style={styles.testBtnText}>TEST LOGIN</Text>
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
    color: "#000", // 👈 this line
  },
  loginBtn: {
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    alignSelf: "center",
  },
  loginBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  testBtn: {
    width: "100%",
    padding: 12,
    borderRadius: 30,
    backgroundColor: "black",
    alignItems: "center",
    marginTop: 10,
  },
  testBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  signupBtn: {
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    alignSelf: "center",
  },
  signupBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  
  
});


export default LoginScreen;

