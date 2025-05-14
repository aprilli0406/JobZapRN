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
          
         <TouchableOpacity
  onPress={() => navigation.navigate('EditUserInfo', { userInfo })}
  activeOpacity={0.8}
  style={{ alignSelf: 'center', marginTop: 20 }} // center + spacing
>
  <LinearGradient
    colors={['#12c2e9', '#c471ed', '#f64f59']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.manageBtn} // ✅ same as Manage My Account
  >
    <Text style={styles.manageBtnText}>Edit</Text>
  </LinearGradient>
</TouchableOpacity>

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
});

export default UserManagement;
