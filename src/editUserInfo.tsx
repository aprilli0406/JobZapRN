import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Switch } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, 'EditUserInfo'>;

const EditUserInfoScreen = ({ route, navigation }: Props) => {
  const { userInfo } = route.params;

  const [formData, setFormData] = useState({ ...userInfo });

  // ✅ Extra frontend-only states
  const [notificationStatus, setNotificationStatus] = useState<boolean>(true);
  const [notificationFrequency, setNotificationFrequency] = useState<string>('2 times a week');

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
    <ScrollView contentContainerStyle={styles.container}>
      {Object.keys(formData).map((key) => (
        <View key={key} style={styles.inputGroup}>
          <Text style={styles.label}>{key}</Text>
          <TextInput
            style={styles.input}
            value={formData[key] || ''}
            onChangeText={(text) => handleChange(key, text)}
          />
        </View>
      ))}

      {/* ✅ Notification Toggle */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Notification Status</Text>
        <Switch
          value={notificationStatus}
          onValueChange={setNotificationStatus}
        />
      </View>

      {/* ✅ Notification Frequency TextInput */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Notification Frequency</Text>
        <TextInput
          style={styles.input}
          value={notificationFrequency}
          onChangeText={setNotificationFrequency}
        />
      </View>

      <Button title="Save" onPress={handleSave} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  inputGroup: { marginBottom: 15 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
  },
});

export default EditUserInfoScreen;
