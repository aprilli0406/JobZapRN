import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  Linking,
  ScrollView,
} from 'react-native';

const GOOGLE_API_KEY = 'AIzaSyDBr1f6s2gag6FlE_odfek2iZcGN1jeT74';
const SEARCH_ENGINE_ID = 'd51ba826ae1d64ed2';

type SearchResultItem = {
    title: string;
    link: string;
    snippet: string;
  };
  
  const UserManageScreen = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResultItem[]>([]);
  
    const searchGoogle = async () => {
      if (!query.trim()) return;
  
      try {
        const response = await fetch(
          `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}`
        );
        const data = await response.json();
        const top5 = data.items?.slice(0, 5) || [];
        setResults(top5);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };
  
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>User Management</Text>
  
        {/* 🔎 Search Box */}
        <Text style={styles.sectionTitle}>Search Top 5 Google Results</Text>
        <TextInput
          style={styles.input}
          placeholder="Type your search query"
          value={query}
          onChangeText={setQuery}
        />
        <Button title="Search" onPress={searchGoogle} />
  
        {/* 📋 Search Result List */}
        <FlatList
          data={results}
          keyExtractor={(item) => item.link}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text
                style={styles.link}
                onPress={() => Linking.openURL(item.link)}
              >
                {item.title}
              </Text>
              <Text>{item.snippet}</Text>
            </View>
          )}
        />
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    container: { padding: 20, marginTop: 40, flex: 1 },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 6,
      padding: 10,
      marginBottom: 10,
    },
    resultItem: {
      marginVertical: 10,
      padding: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 6,
    },
    link: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#007BFF',
      marginBottom: 5,
    },
  });
  
  export default UserManageScreen;