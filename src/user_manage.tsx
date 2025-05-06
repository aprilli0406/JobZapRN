import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchAuthSession } from 'aws-amplify/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App'; // Adjust if needed

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserManage'>;

const UserManagement = () => {
  const navigation = useNavigation<NavigationProp>();

  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getUserId = async (): Promise<string | null> => {
    try {
      const session = await fetchAuthSession();
      const sub = session.tokens?.idToken?.payload['sub'];
      console.log('[DEBUG] Fetched user ID:', sub);
      return sub ?? null;
    } catch (err) {
      console.error('[ERROR] Failed to get user ID:', err);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = await getUserId();
        if (!userId) {
          Alert.alert('Error', 'Please log in first.');
          return;
        }

        const apiUrl = `https://d0g7zriytb.execute-api.us-east-1.amazonaws.com/prod/user?userId=${userId}`;

        console.log('[DEBUG] Fetching user info from:', apiUrl);

        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log('[DEBUG] Fetched user data:', data);

        if (!data || Object.keys(data).length === 0) {
          console.warn('[WARNING] No user data returned from API.');
          Alert.alert('No data', 'User not found in database.');
        }

        setUserInfo(data);
      } catch (err) {
        console.error('[ERROR] Failed to fetch user info:', err);
        Alert.alert('Error', 'Could not load user information.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {userInfo ? (
        <>
          
          <Text style={styles.item}>First Name: {userInfo.firstName || 'N/A'}</Text>
          <Text style={styles.item}>Last Name: {userInfo.lastName || 'N/A'}</Text>
          <Text style={styles.item}>Email: {userInfo.email || 'N/A'}</Text>
          <Text style={styles.item}>Phone: {userInfo.phoneNumber || 'N/A'}</Text>
          <Text style={styles.item}>Location: {userInfo.location || 'N/A'}</Text>
          <Text style={styles.item}>Job Type: {userInfo.jobType || 'N/A'}</Text>
          <Text style={styles.item}>Status: {userInfo.myStatus || 'N/A'}</Text>

          <View style={styles.buttonContainer}>
            <Button
              title="Edit"
              onPress={() => navigation.navigate('EditUserInfo', { userInfo })}
            />
          </View>
        </>
      ) : (
        <Text>No user data found.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  item: {
    fontSize: 16,
    marginVertical: 8,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default UserManagement;
