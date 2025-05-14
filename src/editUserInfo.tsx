import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Switch } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from "../App";
import { TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


type Props = NativeStackScreenProps<RootStackParamList, 'EditUserInfo'>;

const EditUserInfoScreen = ({ route, navigation }: Props) => {
  const { userInfo } = route.params;

  const [formData, setFormData] = useState({ ...userInfo });

  // ✅ Extra frontend-only states
  const [notificationStatus, setNotificationStatus] = useState<boolean>(true);
  const [notificationFrequency, setNotificationFrequency] = useState<string>('2x Weekly')

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSave = async () => {
    try {
      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== undefined && value !== null)
      );

      console.log('[DEBUG] Cleaned formData:', cleanedData);
      console.log('[DEBUG] Notification status:', notificationStatus ? 'on' : 'off');
      console.log('[DEBUG] Frequency:', notificationFrequency);

    

      const response = await fetch('https://d0g7zriytb.execute-api.us-east-1.amazonaws.com/prod/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'User info updated!');
        navigation.goBack();
      } else {
        console.error('[DEBUG] Server responded with error:', result);
        Alert.alert('Error', result.message || 'Update failed.');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

 return (
 <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: '#0e89ec' }}>
    <View style={styles.card}>
      <Text style={styles.title}>Edit User Info</Text>

      {[
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'phoneNumber', label: 'Phone Number' },
  { key: 'location', label: 'Location' },
  { key: 'jobType', label: 'Job Type' },
  { key: 'myStatus', label: 'Status' },
].map(({ key, label }) => (
  <View key={key} style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={formData[key] || ''}
      onChangeText={(text) => handleChange(key, text)}
      placeholder={`Enter ${label}`}
      placeholderTextColor="#888"
    />
  </View>
))}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Notification Status</Text>
        <Switch
          value={notificationStatus}
          onValueChange={setNotificationStatus}
        />
      </View>

      <TouchableOpacity onPress={handleSave} activeOpacity={0.8} style={{ width: '100%', marginTop: 20 }}>
        <LinearGradient
          colors={['#12c2e9', '#c471ed', '#f64f59']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  </ScrollView>
);
};

const styles = StyleSheet.create({
 container: {
  paddingTop: 40,
  paddingBottom: 40,
  flexGrow: 1,
  width: "100%", // fills ScrollView
  alignItems: "stretch", // allows card to stretch too
},
  outer: {
  flex: 1,
  backgroundColor: "#0e89ec",
  justifyContent: "center",
  alignItems: "center",
},
card: {
  backgroundColor: "#fff",
  paddingVertical: 30,
  paddingHorizontal: 20, // smaller side padding
  borderRadius: 12,
  width: "90%",
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 6,
},
title: {
  fontSize: 24,
  fontWeight: "bold",
  marginBottom: 20,
},
input: {
  width: "100%",
  borderWidth: 1,
  borderColor: "#ccc",
  padding: 14,
  borderRadius: 6,
  marginBottom: 16,
  backgroundColor: "#f8f8f8",
  fontSize: 16,
  color: "#000",
},
saveButton: {
  paddingVertical: 14,
  borderRadius: 4,
  alignItems: "center",
  width: "100%",
},
saveButtonText: {
  color: "white",
  fontWeight: "bold",
  fontSize: 16,
},
inputGroup: {
  width: "100%",
  marginBottom: 16,
},
label: {
  alignSelf: "flex-start",
  fontWeight: "bold",
  marginBottom: 6,
}
});

export default EditUserInfoScreen;
