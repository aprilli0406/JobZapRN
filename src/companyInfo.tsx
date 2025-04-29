import React, { useEffect, useState, useLayoutEffect} from 'react';
import { View, Text, StyleSheet, Image, Button, Alert, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { useNavigation} from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

import { StackNavigationProp } from "@react-navigation/stack";

type Job = {
  job_title: string;
  employer_name: string;
  job_city: string;
  job_apply_link: string;
};
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">;


type CompanyInfoNavigationProp = StackNavigationProp<RootStackParamList, 'CompanyInfo'>;
type CompanyInfoRouteProp = RouteProp<RootStackParamList, 'CompanyInfo'>;



const CompanyInfoScreen = () => {
  const navigation = useNavigation<CompanyInfoNavigationProp>();
  const route = useRoute<CompanyInfoRouteProp>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('CompanyManage')}>
          <Text style={{ color: 'blue', marginRight: 15 }}>Manage My Companies</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);


  const { name = '', logo = '', domain = '' } = route.params || {};

  const [jobs, setJobs] = useState<Job[]>([]);

  //  Get Cognito user ID
  const getUserId = async (): Promise<string | null> => {
    try {
      const user = await getCurrentUser(); // basic user info
      const session = await fetchAuthSession(); // full ID token
      const userId = session.tokens?.idToken?.payload?.sub;

      if (!userId) throw new Error('User ID not found in token payload');
      return userId;
    } catch (err) {
      console.error('Failed to get user ID:', err);
      return null;
    }
  };

  // Fetch latest job postings
  const fetchLatestJobs = async (companyName: string) => {
    try {
      const response = await fetch(
        `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(companyName)}&page=1&num_pages=1`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': '103aab4bd6mshca6469e1238f718p1828b7jsn19889daadf73',
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
          },
        }
      );

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Job fetch error:', error);
      return [];
    }
  };

  //  Load jobs on mount
  useEffect(() => {
    const loadJobs = async () => {
      const jobResults = await fetchLatestJobs(name);
      setJobs(jobResults);
    };

    if (name) loadJobs();
  }, [name]);

  // Add company to favorites
  const handleAddToFavorites = async () => {
    try {
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
        Alert.alert('Success', `We're now checking job postings for ${domain}. You’ll receive an email confirmation shortly!`);

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
      <Text style={styles.name}>{String(name)}</Text>
      <Text style={styles.domain}>{String(domain)}</Text>

      <Button title="Add to Favorites" onPress={handleAddToFavorites} />
      

      {/* Show most recent job posting */}
      {jobs.length > 0 && (
        <View style={styles.jobContainer}>
          <Text style={styles.jobTitle}>Recent Job Opening:</Text>
          <Text style={styles.jobText}>{jobs[0].job_title}</Text>
          <Text style={styles.jobText}>
            {jobs[0].employer_name} – {jobs[0].job_city}
          </Text>
          <Text
            style={styles.applyLink}
            onPress={() => Linking.openURL(jobs[0].job_apply_link)}
          >
            Apply Here
          </Text>
        </View>
      )}
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
  jobContainer: {
    marginTop: 30,
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 20,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  jobText: {
    fontSize: 16,
    marginTop: 5,
  },
  applyLink: {
    color: 'blue',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
});

export default CompanyInfoScreen;
