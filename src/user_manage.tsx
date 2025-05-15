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
import { TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

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
    <View style={styles.card}>

      {userInfo ? (
        <>
          {[
            { label: 'First Name', value: userInfo.firstName },
            { label: 'Last Name', value: userInfo.lastName },
            { label: 'Email', value: userInfo.email },
            { label: 'Phone', value: userInfo.phoneNumber },
            { label: 'Location', value: userInfo.location },
            { label: 'Job Type', value: userInfo.jobType },
            { label: 'Status', value: userInfo.myStatus },
          ].map(({ label, value }) => (
            <View style={styles.infoBox} key={label}>
              <Text style={styles.infoText}>
                {label}: {value || 'N/A'}
              </Text>
            </View>
          ))}

          <TouchableOpacity
  onPress={() => navigation.navigate('EditUserInfo', { userInfo })}
  activeOpacity={0.8}
  style={styles.manageBtnSolid}
>
  <Text style={styles.manageBtnText}>Edit</Text>
</TouchableOpacity>

        </>
      ) : (
        <Text style={styles.empty}>No user data found.</Text>
      )}
    </View>
  </ScrollView>
);
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0e89ec',
    padding: 24,
  },
  item: {
    fontSize: 18,
    color: '#333',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  editButton: {
    width: 150,// custom width (adjust as needed)
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  editButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginBtn: {
  width: "100%",
  paddingVertical: 14,
  borderRadius: 4, // squared
  alignItems: "center",
  marginTop: 10,
},
loginBtnText: {
  color: "white",
  fontWeight: "bold",
  fontSize: 16,
},
manageBtn: {
  width: 220,
  paddingVertical: 14,
  borderRadius: 4,
  alignItems: "center",
},
manageBtnText: {
  color: "white",
  fontWeight: "bold",
  fontSize: 16,
},
card: {
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 12,
  width: '100%',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 6,
},
infoBox: {
  backgroundColor: '#fdfdfd',
  borderRadius: 6,
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderWidth: 1,
  borderColor: '#ccc',
  marginBottom: 12,
  width: '100%',
},
infoText: {
  fontSize: 16,
  color: '#333',
},
empty: {
  marginTop: 32,
  textAlign: 'center',
  fontSize: 16,
  color: '#666',
},
title: {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 20,
  color: '#333',
  textAlign: 'center',
},
manageBtnSolid: {
  backgroundColor: '#0059a9',
  paddingVertical: 14,
  borderRadius: 4,
  alignItems: 'center',
  width: '97%',
  marginTop: 20,
},

});

export default UserManagement;
