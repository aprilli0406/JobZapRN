import { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from "react-native";

const AboutUsScreen = () => {
  const [isContactUs, setIsContactUs] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleContactSubmit = () => {
    if (!firstName || !lastName || !email || !message) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    Alert.alert("Success", "Thanks for reaching out! Our team will respond to you as soon as we can.");
    setFirstName("");
    setLastName("");
    setEmail("");
    setMessage("");
  };

  return (
    <View style={styles.container}>
      {/* this is gonna let us switch between main about us page and the contact us page*/}
      <View style={styles.switchContainer}>
        <TouchableOpacity onPress={() => setIsContactUs(false)}>
          <Text style={[styles.switchText, !isContactUs && styles.activeTab]}>About Us</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsContactUs(true)}>
          <Text style={[styles.switchText, isContactUs && styles.activeTab]}>Contact Us</Text>
        </TouchableOpacity>
      </View>

      {isContactUs ? (
        // Contact Us form
        <View>
          <Text style={styles.title}>Contact Us</Text>
          <TextInput placeholder="First Name" style={styles.input} onChangeText={setFirstName} value={firstName} />
          <TextInput placeholder="Last Name" style={styles.input} onChangeText={setLastName} value={lastName} />
          <TextInput 
            placeholder="Email" 
            style={styles.input} 
            keyboardType="email-address" 
            autoCapitalize="none" 
            onChangeText={setEmail} 
            value={email} 
          />
          <TextInput 
            placeholder="Your Message" 
            style={[styles.input, styles.messageInput]} 
            multiline 
            numberOfLines={5} 
            onChangeText={setMessage} 
            value={message} 
          />
          <Button title="Send Message" onPress={handleContactSubmit} />
        </View>
      ) : (
        // About Us page content
        <View>
          <Text style={styles.title}>About JobZap</Text>
          <Text style={styles.description}>
            JobZap is a career search app that allows users to get updated and real-time notifications about new job postings 
            from their favorite companies, allowing them to be among the first applicants. Manage your favorite companies any time,
            and see our personalized job recommendations. First notification, first application! Our goal is to help you transition
            into the next phase of your life. Faster, easier, personalized!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  switchContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  switchText: { fontSize: 18, fontWeight: "bold", marginHorizontal: 15, color: "#777" },
  activeTab: { color: "#000", textDecorationLine: "underline" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  description: { fontSize: 16, textAlign: "center", color: "#555", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  messageInput: { height: 80, textAlignVertical: "top" },
});

export default AboutUsScreen;
