import React from 'react';
import { View, Text, StyleSheet, Image, Button, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';


type CompanyInfoRouteProp = RouteProp<RootStackParamList, 'CompanyInfo'>;

const CompanyInfoScreen = () => {
  const route = useRoute<CompanyInfoRouteProp>();

  const { name = '', logo = '', domain = '' } = route.params || {};

  //  need userId for the 'favorite company' table, so we need to get the userID through Cognito
  const getUserId = async (): Promise<string | null> => {
    try {
      const user = await getCurrentUser(); // basic info
      const session = await fetchAuthSession(); // contains full ID token
      const userId = session.tokens?.idToken?.payload?.sub;

      if (!userId) throw new Error('User ID not found in token payload');

      return userId;
    } catch (err) {
      console.error('Failed to get user ID:', err);
      return null;
    }
  };

  

  const handleAddToFavorites = async () => {
    try {
      // call funtion getUserId()
      const userId = await getUserId();
      if (!userId) {
        Alert.alert('Error', 'Unable to get user ID. Please log in.');
        return;
      }


      const response = await fetch('https://9imynsker8.execute-api.us-east-1.amazonaws.com/AddToFavorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, domain }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', `${domain} was added to your favorites.`);
      } else {
        Alert.alert('Error', data.message || 'Could not add to favorites.');
      }
    } catch (error) {
      console.error('Add to favorites error:', error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: logo }} style={styles.logo} />
      <Text>{String(name)}</Text>
      <Text>{String(domain)}</Text>
      <Button
        title="Add to Favorites"  // This works because the built-in Button handles text internally
        onPress={handleAddToFavorites}
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  domain: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
    marginBottom: 20,
  },
});

export default CompanyInfoScreen;
