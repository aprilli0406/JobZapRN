import React, { useState, useEffect } from 'react';
import { TextInput, View,Button, FlatList, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "../App";

type CompanyResult = {
  domain: string;
  name: string;
  logo: string;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SearchScreen'>;// outside and before the function

// function
const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CompanyResult[]>([]);
  
  //navigation part
  const navigation = useNavigation<NavigationProp>();// navigator needed inside the function 
  

  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await fetch(`https://lhtlrjyqdg.execute-api.us-east-1.amazonaws.com/dev/companies?search=google`);

        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search companies..."
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item.domain}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate(
            'CompanyInfo', {
              name: item.name,
              logo: item.logo,
              domain: item.domain,
          })}>  
            <View style={styles.resultItem}>
              <Image source={{ uri: item.logo }} style={styles.logo} />
              <Text style={styles.resultText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Button
        title="Manage My Account"
        onPress={() => navigation.navigate('UserManage')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 5,
  },
  resultText: {
    fontSize: 16,
  },
});

export default SearchScreen;
